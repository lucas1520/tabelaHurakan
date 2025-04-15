const express = require("express")
const path = require("path")
const fs = require("fs").promises

const app = express()
const port = 3000

let options = {
    root: path.join("public")
}

app.get("/", (req, res) => {
    res.sendFile("index.html", options)
})

app.get("/script.js", (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, "public/script.js"));
});

app.get("/pegarDados", async (req, res) => {
    let data = await fs.readFile("dados.json", "utf-8")
    // Ate entao o data e uma string
    data = JSON.parse(data)
    // Agora e um objeto js

    res.send(data)
})

app.get("/addVolta", async (req, res) => {
    let info = await fs.readFile("dados.json", "utf-8")
    // Info e uma string JSON
    info = JSON.parse(info)
    console.log(info)
    console.log(info.hurakan)
    // Info e um objeto js
    const nomeV = req.query.nome

    info[nomeV].nVoltas++

    res.send(String(info[nomeV].nVoltas))
    fs.writeFile("dados.json", JSON.stringify(info, null, 2), "utf-8")
})

app.listen(port, () => {
    console.log(`Escutando porta: ${port}`)
})
