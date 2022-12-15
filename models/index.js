const bookshelf = require('../bookshelf')

const Title = bookshelf.model('Title', {
    tableName:'titles',
    media_property(){
        return this.belongsTo('MediaProperty')
    }
});


const MediaProperty = bookshelf.model('MediaProperty', {
    tableName:'media_properties',
    titles(){
        return this.hasMany('Title')
    }
});

module.exports = { Title, MediaProperty };

