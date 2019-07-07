/*****************************************
 * actions.js for BigCo, Inc.
 * 2019-01 mamund
 *****************************************/

var component = require('./dorr-component');
var properties = require('./properties');

/*****************************************
 * action handlers for service
 *****************************************/

 module.exports.blank = function(req,res) {
  return new Promise(function(resolve,reject) {
    var body = [];
    if(body) {
      resolve(body);
    }
    else {
      reject({error:"invalid body"});
    }
  });
}

module.exports.create = function(req,res) {
  return new Promise(function(resolve,reject) {
    if(req.body) {
     var body = req.body;
     resolve(
      component(
        { 
          name:'item',
          action:'add',
          item:body,
          props:properties.props,
          reqd:properties.reqd, 
          enums:properties.enums
        }
       )
     );
    }
    else {
      reject({error:"invalid body"});
    }
  });
};

module.exports.list = function(req,res) {
  return new Promise(function(resolve,reject) {
    resolve(component({name:'item',action:'list'}));
  });
}

/********
module.exports.filter = function(req,res) {
  return new Promise(function(resolve,reject){
    if(req.query && req.query.length!==0) {
      resolve(component({name:'item',action:'filter',filter:req.query}));
    }
    else {
      reject({error:"invalid query string"});
    }
  })
}

module.exports.read = function(req,res) {
  return new Promise(function(resolve,reject){
    if(req.params.itemId && req.params.itemId!==null) {
      var id = req.params.itemId;
      resolve(component({name:'item',action:'item',id:id}));
    } 
    else {
      reject({error:"missing id"});
    }
  });
}

module.exports.update = function(req,res) {
  var id,body;
  return new Promise(function(resolve,reject){
    id = req.params.itemId||null;
    body = req.body||null;
    if(id!==null && body!==null) {
       resolve(component(
         {name:'item',
          action:'update',
          id:id,
          item:body,
          props:properties.props,
          reqd:properties.reqd,
          enums:properties.enums}));
     }
     else {
       reject({error:"missing id and/or body"});
     }
  });
}

module.exports.status = function(req,res) {
  var id,body;
  return new Promise(function(resolve,reject){
    id = req.params.itemId||null;
    body = req.body||null;
    if(id!==null && body!==null) {
       resolve(component(
         {name:'item',
          action:'update',
          id:id,
          item:body,
          props:properties.props,
          reqd:properties.reqd,
          enums:properties.enums}));
     }
     else {
       reject({error:"missing id and/or body"});
     }
  });
}

module.exports.close = function(req,res) {
  var id,body;
  return new Promise(function(resolve,reject){
    id = req.params.itemId||null;
    body = req.body||null;
    if(id!==null && body!==null) {
       resolve(component(
         {name:'item',
          action:'update',
          id:id,
          item:body,
          props:properties.props,
          reqd:properties.reqd,
          enums:properties.enums}));
     }
     else {
       reject({error:"missing id and/or body"});
     }
  });
}
*****************************************/

