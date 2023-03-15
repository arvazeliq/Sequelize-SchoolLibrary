const express = require(`express`)
const app = express()

app.use(express.json())

const borrowController = require(`../controllers/borrow.controller`)
let {validateBorrow} = require(`../middlewares/borrow-validation`)
const {authenticate, authorize} = require(`../controllers/auth.controller`)

app.get("/", [authorize], borrowController.getBorrow)
app.get(`/member/:id`, [authorize], borrowController.getBorrowSortByMember)
app.post("/", [authorize], [validateBorrow], borrowController.addBorrowing)
app.get("/return/:id", [authorize], borrowController.returnBook)
app.put("/:id", [authorize], [validateBorrow], borrowController.updateBorrowing)
app.delete("/:id", [authorize], borrowController.deleteBorrowing)

module.exports = app