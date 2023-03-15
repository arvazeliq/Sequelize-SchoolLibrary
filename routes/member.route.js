const express = require(`express`)
const app = express()

app.use(express.json())

const memberController = require(`../controllers/member.controller`)
const {authenticate, authorize} = require(`../controllers/auth.controller`)

app.get("/", [authorize], memberController.getAllMember)
app.post("/", [authorize], memberController.addMember)
app.post("/find", [authorize], memberController.findMember)
app.put("/:id", [authorize], memberController.updateMember)
app.delete("/:id", [authorize], memberController.deleteMember)

module.exports = app