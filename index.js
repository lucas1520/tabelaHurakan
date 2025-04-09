const express = require("express")
const path = require("path")
const fs = require("fs")

const app = express()
const port = 3000

let options = {
    root: path.join("public")
}

app.get("/", (req, res) => {
    // res.send("Hello people")
    res.sendFile("index.html", options)
})

app.get("/script.js", (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, "public/script.js"));
});

app.get("/pegarDados", (req, res) => {
    // ReadFile é assicrono, o (err, data) so é executado dps de finalizar a Promise
    fs.readFile("dados.json", "utf-8", (err, data) => {
        console.log(JSON.parse(data))
        res.status(200).send(JSON.parse(data))
    })

})






app.listen(port, () => {
    console.log(`Escutando porta: ${port}`)
})
