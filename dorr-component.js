/*`******************************************************
 * component middleware module (DORR)
 * Mike Amundsen (@mamund)
 *******************************************************/

var storage = require('./dorr-storage');
var utils = require('./dorr-utils');

module.exports = main;

// **********************************************************************
// DORR OBJECT Module
// args: name, props, reqd, action, id, filter, item
//
// on writes, supports 
// - valid fields
// - required fields
// - enumerated values for a field
// - DOES NOT support field type-checking (number, date, email, etc.)
// - DOES NOT support min/max ranges for a field value
// **********************************************************************
function main(args) {
  var name, rtn, props, reqd, enums;
  var conn, action, id, filter, item;

  elm = args.name||"";    
  props = args.props||[]; 
  reqd = args.reqd||[];
  action = args.action||"list";
  id = args.id||"";
  filter = args.filter||"";
  item = args.item||{};
  reqd = args.reqd||[];
  enums = args.enums||[];
 
  // confirm existence of object storage
  storage({action:'create',object:elm});

  // handle action request
  switch (action) {
    case 'exists':
      rtn = (storage({object:elm, action:'item', id:id})===null?false:true);
      break;
    case 'props' :
      rtn = utils.setProps(item,props);
      break;  
    case 'profile':
      rtn = profile;
      break;
    case 'list':
      rtn = utils.cleanList(storage({object:elm, action:'list'}));
      break;
    case 'read':
    case 'item':
      rtn = utils.cleanList(storage({object:elm, action:'item', id:id}));
      break;
    case 'filter':
      rtn = utils.cleanList(storage({object:elm, action:'filter', filter:filter}));
      break
    case 'add':
      rtn = addEntry(elm, item, props, reqd, enums);
      break;
    case 'update':
      rtn = updateEntry(elm, id, item, props, reqd, enums);
      break;
    case 'remove':
    case 'delete':
      rtn = removeEntry(elm, id);
      break;
    default:
      rtn = null;
      break;
  }
  return rtn;
}

function addEntry(elm, entry, props, reqd, enums) {
  var rtn, item, error;
 
  item = {}
  for(i=0,x=props.length;i<x;i++) {
    if(props[i]!=="id") {
      item[props[i]] = (entry[props[i]]||"");
    }
  }

  error = "";
  for(i=0,x=reqd.length;i<x;i++) {
    if(item[reqd[i]]==="") {
      error += "Missing "+ reqd[i] + " ";
    }
  }

  for(i=0,x=enums.length;i<x;i++) {
    for(var key in enums[i]) {
      //console.log(key);
    }
    if(item[key]!=="") {
      if(enums[i][key].indexOf(item[key])===-1) {
        error += "Invalid enumerator [" + item[key] + "] for " + key + " ";
      }
    }
  }
  
  if(error.length!==0) {
    rtn = utils.exception(error);
  }
  else {
    rtn = storage(
      {
        object:elm, 
        action:'add', 
        item:utils.setProps(item,props)
      }
    );
  }
  
  return rtn;
}

function updateEntry(elm, id, entry, props, reqd, enums) {
  var rtn, check, item, error;

  check = storage({object:elm, action:'item', id:id}); 
  if(check===null || (check.type && check.type==="error")) {
    rtn = utils.exception("File Not Found", "No record on file", 404);
  }
  else {
    item = check;
    for(i=0,x=props.length; i<x; i++) {
      if(props[i]!=="id") {
        item[props[i]] = (entry[props[i]]===undefined?check[props[i]]:entry[props[i]]);
      }
    }

    error = "";
    for(i=0,x=reqd.length;i<x;i++) {
      if(item[reqd[i]]==="") {
        error += "Missing "+ reqd[i] + " ";
      }
    }

    for(i=0,x=enums.length;i<x;i++) {
      for(var key in enums[i]) {
        //console.log(key);
      }
      if(item[key]!=="") {
        if(enums[i][key].indexOf(item[key])===-1) {
          error += "Invalid enumerator [" + item[key] + "] for " + key + " ";
        }
      }
    }
    
    if(error!=="") {
      rtn = utils.exception(error);
    } 
    else {
      rtn = storage(
        {
          object:elm, 
          action:'update', 
          id:id, 
          item:utils.setProps(item, props)
        }
      );
    }
  }
  
  console.log(rtn);
  
  return rtn;
}

function removeEntry(elm, id) {
  var rtn, check;
  
  check = storage({object:elm, action:'item', id:id});
  if(check===null) {
    rtn = utils.exception("File Not Found", "No record on file", 404);
  }
  else {
    storage({object:elm, action:'remove', id:id});
    rtn = storage({object:elm,action:'list'});
  }
  
  return rtn;
  
}
// EOF

