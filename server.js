const express = require(`express`)
const app = express()
const PORT = 8000
const cors = require(`cors`)

app.use(cors())
app.use(express.static(__dirname))

const memberRoute = require(`./routes/member.route`)
const adminRoute = require(`./routes/admin.route`)
const bookRoute = require(`./routes/book.route`)
const borrowRoute = require(`./routes/borrow.route`)
const authRoute = require(`./routes/auth.route`)

app.use(`/member`, memberRoute)
app.use(`/admin`, adminRoute)
app.use(`/book`, bookRoute)
app.use(`/borrow`, borrowRoute)
app.use(`/auth`, authRoute)

app.use((express.static(__dirname)))

app.listen(PORT, () => {
    console.log(`Server of School's runs on port ${PORT}`)
})