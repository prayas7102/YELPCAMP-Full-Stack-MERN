const Joi=require('joi');
const validator = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        //image: Joi.array(),
        location: Joi.string().required(),
        description: Joi.string().required()
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