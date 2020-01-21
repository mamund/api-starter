/*****************************************
// bigco, inc
// company response representations
// 2020-02-01 : mamund
 *****************************************/

// load representors
var appJson = require('./representors/app-json');
var formsJson = require('./representors/forms-json');
var linksJson = require('./representors/links-json');
var pragJson = require('./representors/prag-json');
var textCsv = require('./representors/text-csv');

// support form encoding
exports.urlencoded = true;

// return supported response bodies
exports.getTemplates = function() {
  var list = [];
  
  list.push(appJson.template);
  list.push(formsJson.template);
  list.push(textCsv.template);
  list.push(linksJson.template);
  list.push(pragJson.template);

  return list;  
}

// return supported response identifiers
exports.getResponseTypes = function() {
  var rtn  = [];
  var viewList = this.getTemplates();

  viewList.forEach(function(item) {
    rtn.push(item.format);
  });
  
  return rtn;
}

// init to hold forms/links
exports.forms = {
  pageForms: [],
  itemForms: []
}



