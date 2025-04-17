const express = require("express")
const path = require("path")
const fs = require("fs").promises
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app);
const io = new Server(server)

app.use(express.static('public'));

io.on("connection", (socket) => {
    console.log(`Conexao: ${socket.id}`)
})

const port = 3000
server.listen(port, () => {
    console.log(`Escutando porta: ${port}`)
})


app.get("/pegarDados", async (req, res) => {
    let data = await fs.readFile("dados.json", "utf-8")
    // Ate entao o data e uma string
    data = JSON.parse(data)
    // Agora e um objeto js

    res.send(data)
})

const inicio = process.hrtime.bigint()

let times = {
    hurakan: {
        tempoInicialVolta: inicio,
        tempoVolta: 0
    },
    baia: {
        tempoInicialVolta: inicio,
        tempoVolta: 0
    }
}

app.get("/addVolta", async (req, res) => {
    let info = await fs.readFile("dados.json", "utf-8")
    // Info e uma string JSON
    info = JSON.parse(info)
    console.log(info)
    // Info e um objeto js
    const nomeV = req.query.nome

    info[nomeV].nVoltas++

    const tempoVolta = process.hrtime.bigint()
    const diff = tempoVolta - times[nomeV].tempoInicialVolta
    const diffConvertido = Number(diff) / 1e9
    
    info[nomeV].voltas.push(diffConvertido)

    times[nomeV].tempoInicialVolta = process.hrtime.bigint();

    if (diffConvertido < info[nomeV].melhorTempo) {
        info[nomeV].melhorTempo = diffConvertido
    }

    res.send(String(info[nomeV].nVoltas))
    fs.writeFile("dados.json", JSON.stringify(info, null, 2), "utf-8")
})

setInterval(() => {
    const agora = process.hrtime.bigint()
    const diff = agora - inicio
    // console.log(Number(diff) / 1e9)
    io.emit("tempo", Number(diff) / 1e9)
}, 250)
