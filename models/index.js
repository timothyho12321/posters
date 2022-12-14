const bookshelf = require('../bookshelf')

const Title = bookshelf.model('Title', {
    tableName: 'titles',
    media_property() {
        return this.belongsTo('MediaProperty')
    },
    tags() {
        return this.belongsToMany('Tag', 'titles_tags')
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
        return this.belongsToMany('Title', 'titles_tags')
    }
})

const User = bookshelf.model('User', {
    tableName: "users"

})

const CartItem = bookshelf.model('CartItem', {
    tableName: 'cart_items',
    title() {
        return this.belongsTo('Title')

    }

})

const BlackListedToken = bookshelf.model('BlackListedToken',{
    tableName:'blacklisted_tokens'
})


module.exports = { Title, MediaProperty, Tag, User, CartItem, BlackListedToken };

