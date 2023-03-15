const Joi = require(`joi`).extend(require('@joi/date'))

const validateBorrow = (request, response, next) => {
    const rules = Joi
        .object()
        .keys({
            memberID: Joi.number().required(),
            adminID: Joi.number().required(),
            date_of_borrow: Joi.date().format(['YYYY-MM-DD', 'DD-MM-YYYY']),
            date_of_return: Joi.required(),
            status: Joi.required(),
            details_of_borrow: Joi.required()
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

module.exports = {validateBorrow}