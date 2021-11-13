const Joi=require('joi');
const validator = Joi.object({
    campgrounds: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
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