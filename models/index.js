const bookshelf = require('../bookshelf')

const Title = bookshelf.model('Title', {
    tableName:'titles'
});

module.exports = { Title };

