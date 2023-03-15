const Joi = require(`joi`)

const validateBook = (request) => {
    const rules = Joi
        .object()
        .keys({
            isbn: Joi.string().length(13).required(),
            title: Joi.string().required(),
            author: Joi.string().required(),
            publisher: Joi.string().required(),
            category: Joi.string().required(),
            stock: Joi.number().required(),
        })
        .options({abortEarly: false})
    let {error} = rules.validate(request.body)
    if (error != null){
        let errorMessage = error.details.map(it => it.message).join(",")
        return {
            success: false,
            message: errorMessage
        }
    }
    return {
        status: true
    }
}

module.exports = validateBook