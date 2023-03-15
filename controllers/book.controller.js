const bookModel = require(`../models/index`).book
const bookValidation = require(`../middlewares/book-validation`)
const Op = require(`sequelize`).Op
const path = require(`path`)
const fs = require(`fs`)

const upload = require(`./upload-cover`).single(`cover`)

exports.getAllBook = async (request, response) => {
    let books = await bookModel.findAll()
    return response.json({
        success: true,
        data : books,
        Message: `All Books have been loaded`
    })
}
exports.findBook = async (request, response) => {
    let keyword = request.body.keyword
    let books = await bookModel.findAll({
        where: {
            [Op.or]: [
                {isbn: {[Op.substring]: keyword}},
                {title: {[Op.substring]: keyword}},
                {author: {[Op.substring]: keyword}},
                {category: {[Op.substring]: keyword}},
                {publisher: {[Op.substring]: keyword}}
            ]
        }
    })
    return response.json({
        success: true,
        data: books,
        message: `All Books have been loaded`
    })
}
exports.addBook = (request, response) => {
    upload(request, response, async error => {
        if(error){
            return response.json({message:error})
        }
        if(!request.file){
            return response.json({message: `Nothing to upload`})
        }
        let resultValidation = bookValidation(request)
        if (!resultValidation.status){
            return response.json({
                status: false,
                message : resultValidation.message
            })
        }
        let newBook = {
            isbn: request.body.isbn,
            title: request.body.title,
            author: request.body.author,
            publisher: request.body.publisher,
            category: request.body.category,
            stock: request.body.stock,
            cover: request.file.filename
        }
        bookModel.create(newBook)
            .then(result => {
                return response.json({
                    success: true,
                    data: result,
                    message: `New Book has been inserted`
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
exports.updateBook = async (request, response) => {
    upload(request, response, async error => {
        if(error){
            return response.json({message: error})
        }
        let resultValidation = bookValidation(request)
        if (!resultValidation.status){
            return response.json({
                status: false,
                message : resultValidation.message
            })
        }
        let id = request.params.id
        let book = {
            isbn: request.body.isbn,
            title: request.body.title,
            author: request.body.author,
            publisher: request.body.publisher,
            category: request.body.category,
            stock: request.body.stock
        }
        if(request.file){
            const selectedBook = await bookModel.findOne({
                where: {id: id}
            })
            const oldCoverBook = selectedBook.cover
            const pathCover = path.join(__dirname, `../cover`, oldCoverBook)
            if(fs.existsSync(pathCover)){
                fs.unlink(pathCover, error => console.log(error))
            }
            book.cover =  request.file.filename
        }
        bookModel.update(book, {where: {id: id}})
            .then(result => {
                return response.json({
                    success: true,
                    message: `Data Book has been updated`
                })
            })
            .catch(error => {
                return response.json({
                    success: false,
                    massage: error.message
                })
            })
    })
}
exports.deleteBook = async (request, response) => {
    const id = request.params.id

    const book = await bookModel.findOne({where: {id:id}})
    const oldCoverBook = book.cover
    const pathCover = path.join(__dirname, `../cover`, oldCoverBook)
    if(fs.existsSync(pathCover)){
        fs.unlink(pathCover, error => console.log(error))
    }
    bookModel.destroy({where: {id:id}})
        .then(result => {
            return response.json({
                success: true,
                message: `Data Book has been deleted`
            })
        })
        .catch(error => {
            return response.json({
                success: true,
                message: error.message
            })
        })
}