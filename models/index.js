const bookshelf = require('../bookshelf')

const Title = bookshelf.model('Title', {
    tableName:'titles'
});


const MediaProperty = bookshelf.model('MediaProperty', {
    tableName:'media-properties'
});

module.exports = { Title, MediaProperty };

