const express = require(`express`)
const app = express()

app.use(express.json())

const bookController = require(`../controllers/book.controller`)
const {authenticate, authorize} = require(`../controllers/auth.controller`)

app.get("/", [authorize], bookController.getAllBook)
app.post("/", [authorize], bookController.addBook)
app.post("/find", [authorize], bookController.findBook)
app.put("/:id", [authorize], bookController.updateBook)
app.delete("/:id", [authorize], bookController.deleteBook)

module.exports = app