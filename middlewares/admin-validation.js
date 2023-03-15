const Joi = require(`joi`)

const validateAdmin = (request, response, next) => {
    const rules = Joi
        .object()
        .keys({
            name: Joi.string().required(),
            contact: Joi.number().required(),
            address: Joi.string().required(),
            username: Joi.string().min(8).max(30),
            password: Joi.string().min(8).max(30),
        })
        .options({abortEarly: false})
    let {error} = rules.validate(request.body)
    if (error != null){
        let errorMessage = error.details.map(it => it.message).join(",")

        return response.status(442).json({
            success: false,
            message: errorMessage
        })
    }
    next() 
}

module.exports = {validateAdmin}