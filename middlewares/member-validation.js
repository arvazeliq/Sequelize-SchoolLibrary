const Joi = require(`joi`)

const validateMember = (request) => {
    const rules = Joi
        .object()
        .keys({
            name: Joi.string().required(),
            address: Joi.string().required(),
            contact: Joi.number().required(),
            gender: Joi.string().valid(`Male`, `Female`)
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

module.exports = validateMember