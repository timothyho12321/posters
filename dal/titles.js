const { Title, MediaProperty, Tag } = require('../models')


async function getAllMediaProperties() {

    const allMediaProperties = await MediaProperty.fetchAll().map((property) => {
        return [property.get("id"), property.get("name")]
    })

    return allMediaProperties;

}


module.exports = { getAllMediaProperties }