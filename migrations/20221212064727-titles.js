'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {



  return db.createTable('titles', {
    'id': {
      type: "int",
      primaryKey:true,
      autoIncrement: true,
      unsigned: true
    },
    'title': {
      type: "string",
      length: 255,
      notNull: true
    },
    'cost': {
      type: "int",
      unsigned: true,
      notNull: true
    }, 'description': {
      type: "string",
      length: 1000,
      notNull: true
    }, 'date': {
      type: "date",
      notNull: true
    }, 'stock': {
      type: "int",
      unsigned: true,
      notNull: false
    }, 'height': {
      type: "int",
      unsigned: true,
      notNull: true
    }, 'width': {
      type: "int",
      unsigned: true,
      notNull: true
    }

  })


};

exports.down = function (db) {
  return db.dropTable('titles');
};

exports._meta = {
  "version": 1
};
