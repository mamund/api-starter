// ****************************************
// DARRT framework
// data elements 
// properties, requireds, and enums
// 2020-02-01 : mamund
// ****************************************

// this service's message properties
exports.props = [
  'id',
  'givenName',
  'familyName',
  'telephone',
  'email',
  'status',
  'dateCreated',
  'dateUpdated'
];

// required properties
exports.reqd = ['id',,'email','status'];

// enumerated properties
exports.enums = [
  {status:['pending','active','suspended','closed']}
];

