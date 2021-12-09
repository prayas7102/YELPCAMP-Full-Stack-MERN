const BaseJoi=require('joi');
const sanitize=require('sanitize-html');
const extension= (joi) => ({
    type:'string',
    base: joi.string(),
    messages:{'string.escapeHTML':'{{#label}} must not include HTML!'},
    rules:{
        escapeHTML:{
            validate(value,helpers){
                const clean= sanitize(value,{allowedTags:[],allowedAttribute: {}});
                if(clean !== value) return helpers.error('string.escapeHTML',{value})
                return clean;
            }
        }
    }
});
const Joi=BaseJoi.extend(extension);
const validator = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        image: Joi.array(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    delete: Joi.array()
});
module.exports=validator;
/*
const reviewvalidator = Joi.object({
    Review: Joi.object({
        body: Joi.string().required(),
        star: Joi.number().required().min(1),
    }).required()
});
module.exports=reviewvalidator;*/