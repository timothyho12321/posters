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
  return db.createTable('titles_tags', {

    id: { type: 'int', primaryKey: true, autoIncrement: true },
    title_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'titles_tags_title_fk',
        table: 'titles',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    tag_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'titles_tags_tag_fk',
        table: 'tags',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    }

  });

};

exports.down = function (db) {
  return db.dropTable('titles_tags');
};

exports._meta = {
  "version": 1
};
