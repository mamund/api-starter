/*******************************************************
 * module: ejs helpers for DARRT
 * Mike Amundsen (@mamund)
 *******************************************************/


// token replacement
// val = "{id}"
// state = {id:"123",....}
// def = "<default-value>"
//
// note: {makeid} is special, generates unique ID
exports.stateValue = function(val, state, request, def) {
  var v = val.toString()||"";
  var st = state||{};
  var d = def||v;
  var x=0;
  req = request||{};
  
  // handle special macros
  if(v.indexOf("{makeid}")!==-1) {
    v = v.replace("{makeid}",makeId());
    x=1
  }
  if(v.indexOf("{fullurl}")!==-1) {
    v = v.replace("{fullurl}",(req ? req.protocol : "http") + "://" + (req.get ? req.get("Host") : "") + (req ? req.originalUrl : "/"));
    x=1;
  }
  if(v.indexOf("{fullhost}")!==-1) {
    v = v.replace("{fullhost}",(req ? req.protocol : "http") + "://"+ (req.get ? req.get("Host") : ""));  
    x=1;
  }
  
  // handle named properties
  for(s in st) {
    if(v.indexOf('{'+s+'}')!==-1) {
      v = v.replace('{'+s+'}',st[s]);
      x=1;
    }
  }
  
  // insert default, if nothing found
  if(x==0) {
    v = d;
  }
  
  return v;
}

// immediate if
exports.iif = function(cond,value){
  if(cond) return value;
  return '';
}  

// for testing
exports.sayHi = function(name) {
  return "Hello " + name;
} 


// local unique id generator
function makeId() {
  var rtn;

  rtn = String(Math.random());
  rtn = rtn.substring(2);
  rtn = parseInt(rtn).toString(36);

  return rtn;
}
