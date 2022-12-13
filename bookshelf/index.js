const knex = require('knex')({
    'client':'mysql',
    'connection':{
        'user':'foo',
        'password':'bar',
        'database':'poster_shop'
    }
})

// create bookshelf
const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;