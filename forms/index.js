// import in caolan forms
const forms = require("forms");
// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};


const createTitleForm = (allMediaProperties = [], allTags = []) => {



    return forms.create({
        'title': fields.string({
            required: true,
            errorAfterField: true
        }),
        'cost': fields.number({
            required: true,
            errorAfterField: true,
            validators: [validators.integer()]
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true
        }),
        'date': fields.date({
            required: true,
            errorAfterField: true,
            validators: [validators.date()]
        }),
        'stock': fields.number({
            required: false,
            errorAfterField: false
        }),
        'height': fields.number({
            required: true,
            errorAfterField: true
        }),
        'width': fields.number({
            required: true,
            errorAfterField: true
        }),
        'media_property_id': fields.string({
            label: "Media Property",
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: allMediaProperties

        }),
        'tags_id': fields.string({
            'required': true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: allTags
        }),
        'image_url': fields.string({
            widget: widgets.hidden()
        })



    })


}


const createRegistrationForm = () => {
    return forms.create({
        'username': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }), 'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'confirm_password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.matchField('password')]
        })
    })
}

const createLoginForm = () => {
    return forms.create({
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        })
        ,
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        })
    })


}

const createSearchForm = (allMediaProperties = [], allTags = []) => {
    return forms.create({
        'title': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label'],

            }
        }),
        'min_cost': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer()]
        }),
        'max_cost': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer()]

        }),
        'min_height': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer()]

        }), 'max_height': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer()]

        }),
        'min_width': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer()]

        }), 'max_width': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer()]

        }),

        'media_property_id': fields.string({
            label: 'Media Property',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: allMediaProperties

        }),
        'tags_id': fields.string({
            label: 'Category',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: allTags

        })




    })
}






module.exports = {
    bootstrapField, createTitleForm, createRegistrationForm,
    createLoginForm, createSearchForm
}