const bookshelf = require('../bookshelf')

const Title = bookshelf.model('Title', {
    tableName: 'titles',
    media_property() {
        return this.belongsTo('MediaProperty')
    },
    tags() {
        return this.belongsToMany('Tag')
    }
});


const MediaProperty = bookshelf.model('MediaProperty', {
    tableName: 'media_properties',
    titles() {
        return this.hasMany('Title')
    }
});

const Tag = bookshelf.model('Tag', {
    tableName: 'tags',
    titles() {
        // the first parameter of the belongsToMany function is the MODEL NAME
        // that is partaking in the relatonship
        return this.belongsToMany('Title')
    }
})


module.exports = { Title, MediaProperty, Tag };

