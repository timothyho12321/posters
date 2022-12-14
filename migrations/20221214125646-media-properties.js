'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(db) {
  return db.createTable("media_properties",{
    "id":{
      type:'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    }, 
    "name":{
      type: 'string',
      length: 100,
      notNull:true
    }
  })
};

exports.up = function(db) {
  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
