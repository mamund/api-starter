/*******************************************************
 * module: internal utilities
 * Mike Amundsen (@mamund)
 *******************************************************/

var fs = require('fs');
var qs = require('querystring');
var folder = process.cwd() + '/files/';
var ejs = require('ejs');
var jsUtil = require('util');
var ejsHelper = require('./ejs-helpers');

// for handling hal-forms extension
var halFormType = "application/prs.hal-forms+json";
var sirenSopType = "application/prs.siren-sop+json";

// load up action map (for Siren)
var httpActions = {};
httpActions.append = "POST";
httpActions.partial = "PATCH";
httpActions.read = "GET";
httpActions.remove = "DELETE";
httpActions.replace = "PUT";

// map WeSTL actions to HTTP
exports.actionMethod = function(action, protocol) {
  var p = protocol||"http";
  var rtn = "GET";

  switch(p) {
    case "http":
      rtn = httpActions[action];
      break;
    default:
      rtn = "GET";
  }
  return rtn;
}

// only write 'known' properties for an item
exports.setProps = function(item, props) {
  var rtn, i, x, p;
    
  rtn = {};  
  for(i=0,x=props.length;i<x;i++) {
    p = props[i];
    rtn[p] = (item[p]||"");
  }
  return rtn;
}

// produce clean array of items
exports.cleanList = function(elm) {
  var coll;

  coll = [];
  if(Array.isArray(elm) === true) {
    coll = elm;
  }
  else {
    if(elm!==null) {
      coll.push(elm);
    }
  }

  return coll;
}

// generate a unique id 
exports.makeId = function() {
  var rtn;

  rtn = String(Math.random());
  rtn = rtn.substring(2);
  rtn = parseInt(rtn).toString(36);

  return rtn;
}

// craft an external error response (anything, really)
exports.errorResponse = function(req, res, msg, code, description) {
  var doc;

  doc = {};
  doc.error = {};
  doc.error.code = code;
  doc.error.message = msg||description;
  doc.error.url = 'http://' + req.headers.host + req.url;
  if (description) {
    doc.error.description = description;
  }

  return {
    code: code,
    doc: doc
  };
}

// simple file responder
//
// ASSUMES: 
// - only files to deal with are JS, CSS & HTML
// - all of them are in a single sub-folder (FILES)
// - NOTE: this is a *synch* routine w/o streaming
//
exports.file = function(req, res, parts, respond) {
  var body, doc, type;

  try {
    body = fs.readFileSync(folder + parts[1]);
    
    type = 'text/plain';
    if (parts[1].indexOf('.js') !== -1) {
      type = 'application/javascript';
    }
    if (parts[1].indexOf('.css') !== -1) {
      type = 'text/css';
    }
    if (parts[1].indexOf('.html') !== -1) {
      type = 'text/html';
    }
    if(req.headers["accept"].indexOf(halFormType)!==-1) {
      type = halFormType;
    }
    if(req.headers["accept"].indexOf(sirenSopType)!==-1) {
      type = sirenSopType;
    }
    
    respond(req, res, {
      code: 200,
      doc: body,
      headers: {
        'content-type': type
      },
      file: true
    });
  } catch (ex) {
    respond(req, res, this.errorResponse(req, res, "File Not Found", 404));
  }
}

// dispatch for parsing incoming HTTP bodies
// ALWAYS returns JSON NVP collection
//
exports.parseBody = function(body, ctype) {
  var msg;
  
  switch (ctype) {
    case "application/x-www-form-urlencoded":
      msg = qs.parse(body);
      break;
    case "application/vnd.collection+json":
      msg = cjBody(body);
      break;
    default:
      msg = JSON.parse(body);
      break;
  }
  return msg;
}

// process an incoming cj template body
exports.cjBody = cjBody;
function cjBody(body) {
  var rtn, data, i, x;
  
  rtn = {};
  data = null;
  body = JSON.parse(body);
  
  // if they include template...
  if(body.template && body.template.data) {
    data = body.template.data;
  }

  // if they only pass data array...
  if(data===null && body.data) {
    data = body.data;
  }

  // create nvp dictionary
  if(data!==null) {
    for(i=0,x=data.length;i<x;i++) {
      rtn[data[i].name]=data[i].value;
    }
  }
  
  return rtn;
}

// parse the querystring args
exports.getQArgs = getQArgs;
function getQArgs(req) {
  var q, qlist;
  
  qlist = null;
  q = req.url.split('?');
  if (q[1] !== undefined) {
    qlist = qs.parse(q[1]);
  }
  return qlist;
}

// craft an internal exception object
// based on RFC7807 (problem details
exports.exception = function(name, message, code, type, url) {
  var rtn = {};

  rtn.type = (type||"error");
  rtn.title = (name||"Error");
  rtn.detail = (message||name);
  rtn.status = (code||400).toString();
  if(url) {rtn.instance = url};

  return rtn;
}

// local exeption routine
function exception(name, message, code, type, url) {
  var rtn = {};

  rtn.type = (type||"error");
  rtn.title = (name||"Error");
  rtn.detail = (message||rtn.title);
  rtn.status = (code||400).toString();
  if(url) {rtn.instance = url};

  return rtn;
}

// ejs-dependent response emitter
// handle formatting response
// depends on ejs templating
exports.handler = function(req, res, fn, type, representation){
  var rtn = {};
  var xr = [];
  var oType = type||"collection";

  var filter = representation.filter||"";
  var templates = representation.templates||[];
  var template = resolveAccepts(req, templates);

  var forms = representation.forms||{};
  var pForms = forms.pageForms||[];
  var iForms = forms.itemForms||[];
  
  var metadata = representation.metadata||[];
  
  pForms = tagFilter(pForms,filter);
  iForms = tagFilter(iForms,filter);
  metadata = tagFilter(metadata,filter);
    
  fn(req,res).then(function(body) {
    if(jsUtil.isArray(body)===true) {
      oType = type||"collection";
      if(body.length!==0 && body[0].type && body[0].type==="error") {
        xr.push(exception(
          body[0].name||body[0].title,
          body[0].message||body[0].detail,
          body[0].code||body[0].status,
          body[0].oType,
          'http://' + req.headers.host + req.url
        ));
        rtn = xr;
        oType="error";
      }
      else {
        rtn = body
      }
    }
    else {
      oType = type||"item";
      if(body.type && body.type==='error') {
        xr.push(exception(
          body.name||body.title,
          body.detail,
          body.code||body.status,
          body.oType,
          'http://' + req.headers.host + req.url
        ));
        rtn = xr;
        oType="error";
      }  
      else  {
        rtn = [body];
      } 
    }

    if(oType==="error") {
      res.setHeader("content-type","application/problem+json");
      res.status(rtn.code||400).send(JSON.stringify({error:rtn},null,2));
    }
    else {
      var reply = "";
      rtn = {rtn:rtn,type:oType, pForms:pForms,iForms:iForms, metadata:metadata, helpers:ejsHelper, request:req};
      if(template.view!=="") {
        reply= ejs.render(template.view, rtn);
      }
      else {
        reply = JSON.stringify(rtn, null, 2);
      }
      // clean up blank lines
      reply = reply.replace(/^\s*$[\n\r]{1,}/gm, '');
      
      res.type(template.format);
      res.send(reply);
    }
  }).catch(function(err) {
    xr.push(exception(
      "Server error",
      err.message||"Internal error",
      '500',
      "error",
      'http://' + req.headers.host + req.url
    ));
    res.setHeader("content-type","application/problem+json");      
    res.status(500).send(JSON.stringify({error:xr},null,2));
  });
}

function sayHi(name) {
    return 'Hello ' + name;
};

// sort out accept header
function resolveAccepts(req, templates) {
  var rtn = "";
  var fallback = {format:"application/json",view:""};
  
  templates.forEach(function(template) {
    if(rtn==="" && req.accepts(template.format)) {
      rtn = template;
    }
  });
  if(rtn==="") {
    rtn = fallback;
  }
  return rtn;
}

// tag filter
function tagFilter(collection, filter) {
  var coll = collection||[];
  var tag = filter||"";
  var rtn = [];
  
  if(tag==="") {
    rtn = coll;
  }
  else {
    coll.forEach(function(item) {
      f = item.tags||"";
      if(f==="") {
        rtn.push(item);
      }
      else {
        if(f.indexOf(tag)!==-1) {
          rtn.push(item);
        }
      }
    });
  }
  return rtn;
}

// EOF

