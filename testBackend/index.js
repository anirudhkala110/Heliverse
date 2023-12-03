const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())

app.use(cors())
const port = 8040;

app.get('/', (req, res) => {
    res.json("Home Page of backend")
})
app.listen(port, (res, err) => {
    console.log(`Connected at port ${port}`)
    return ("Connected")
})