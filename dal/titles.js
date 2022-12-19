const { Title, MediaProperty, Tag } = require('../models')



async function getAllTitles(q) {

    const titles = await q.fetch({
        withRelated: ['tags', 'media_property'] // for each product, load in each of the tag
    });
    return titles;

}

async function getAllMediaProperties() {

    const allMediaProperties = await MediaProperty.fetchAll().map((property) => {
        return [property.get("id"), property.get("name")]
    })

    return allMediaProperties;

}


async function createNewTitle(form) {

    const titleObject = new Title();

    let { tags_id, ...productData } = form.data;
    titleObject.set(productData)
    await titleObject.save();


    if (tags_id) {

        await titleObject.tags().attach(tags_id.split(","));
    }

    return titleObject;

}


async function findOneTitle(posterId){
    const title = await Title.where({
        'id': posterId
    }).fetch({
        require: true,
        withRelated: ['tags']
    })

    return title;

}




module.exports = { getAllMediaProperties, getAllTitles, createNewTitle, findOneTitle }