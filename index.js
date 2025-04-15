const express = require("express")
const path = require("path")
const fs = require("fs").promises
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app);
const io = new Server(server)

io.on("connection", (socket) => {
    console.log(`Conexao: ${socket.id}`)
})

const port = 3000

app.use(express.static('public'));

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

server.listen(port, () => {
    console.log(`Escutando porta: ${port}`)
})

let t = 0;
setInterval(() => {
    t++;
    io.emit("tempo", t)
}, 250)
