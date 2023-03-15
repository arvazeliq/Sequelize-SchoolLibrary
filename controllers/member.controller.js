const memberModel = require('../models/index').member
const memberValidation = require(`../middlewares/member-validation`)
const Op = require('sequelize').Op
const path = require(`path`)
const fs = require(`fs`)

const upload = require(`./upload-profile`).single(`profile`)

exports.getAllMember = async (request, response) => {
    let members = await memberModel.findAll()
    return response.json({
        success: true,
        data: members,
        message: `All Members have been loaded`
    })
}
exports.findMember = async (request, response) => {
    let keyword = request.body.keyword
    let members = await memberModel.findAll({
        where: {
            [Op.or]: [
                {name: {[Op.substring]: keyword}},
                {gender: {[Op.substring]: keyword}},
                {address: {[Op.substring]: keyword}}
            ]
        }
    })
    return response.json({
        success: true,
        data: members,
        message: `All Members have been loaded`
    })
}
exports.addMember = (request, response) => {
    upload(request, response, async error => {
        if(error){
            return response.json({message:error})
        }
        if(!request.file){
            return response.json({message: `Nothing to upload`})
        }
        let resultValidation = memberValidation(request)
        if (!resultValidation.status){
            return response.json({
                status: false,
                message : resultValidation.message
            })
        }
        let newMember = {
            name: request.body.name,
            address: request.body.address,
            gender: request.body.gender,
            contact: request.body.contact,
            profile: request.file.filename
        }
        memberModel.create(newMember)
            .then(result => {
                return response.json({
                    success: true,
                    data: result,
                    message: `New Member has been inserted`
                })
            })
            .catch(error => {
                return response.json({
                    success: false,
                    message: error.message
                })
            })
    })
}
exports.updateMember = (request, response) => {
    upload(request, response, async error => {
        if(error){
            return response.json({message: error})
        }
        let idMember = request.params.id
        let resultValidation = memberValidation(request)
        if (!resultValidation.status){
            return response.json({
                status: false,
                message : resultValidation.message
            })
        }
        let dataMember = {
            name: request.body.name,
            address: request.body.address,
            gender: request.body.gender,
            contact: request.body.contact
        }
        if(request.file){
            const selectedMember = await memberModel.findOne({
                where: {id: idMember}
            })
            const oldProfile = selectedMember.profile
            const pathProfile = path.join(__dirname, `../profile`, oldProfile)
            if(fs.existsSync(pathProfile)){
                fs.unlink(pathProfile, error => console.log(error))
            }
            dataMember.profile = request.file.filename
        }
        memberModel.update(dataMember, {where: {id: idMember}})
            .then(result => {
                return response.json({
                    success: true,
                    message: `Data Member has been updated`
                })
            })
            .catch(error => {
                return response.json({
                    success: false,
                    message: error.message
                })
            })
    })
}
exports.deleteMember = async (request, response) => {
    let idMember = request.params.id
    const member = await memberModel.findOne({where: {id: idMember}})
    const oldProfile = member.profile
    const pathProfile = path.join(__dirname, `../profile`, oldProfile)
    if(fs.existsSync(pathProfile)){
        fs.unlink(pathProfile, error => console.log(error))
    }
    memberModel.destroy({where: {id: idMember}})
        .then(result => {
            return response.json({
                success: true,
                message: `Data Member have been updated`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}