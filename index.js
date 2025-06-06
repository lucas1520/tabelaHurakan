const express = require("express")
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

    let posicoes = atualizaPosicoes(data)

    // res.send(data)
    res.send({
        data,
        posicoes
    })
})

let inicio

let times = {
    hurakan: {
        tempoInicialVolta: inicio,
        tempoVolta: 0
    },
    baia: {
        tempoInicialVolta: inicio,
        tempoVolta: 0
    },
    holandes: {
        tempoInicialVolta: inicio,
        tempoVolta: 0
    },
    ufsc: {
        tempoInicialVolta: inicio,
        tempoVolta: 0
    },
    ifsc: {
        tempoInicialVolta: inicio,
        tempoVolta: 0
    }
}

const atualizaPosicoes = (info) => {
    let posicoes = [];
    Object.entries(info).forEach((elem) => {
        posicoes.push({nome: elem[1].nome, nVoltas: elem[1].nVoltas})
    })

    posicoes.sort((a, b) => b.nVoltas - a.nVoltas)
    return posicoes
}

app.get("/addVolta", async (req, res) => {
    let info = await fs.readFile("dados.json", "utf-8")
    // Info e uma string JSON
    info = JSON.parse(info)
    console.log(info)
    // Info e um objeto js
    const nomeV = req.query.nome

    info[nomeV].nVoltas++

    let posicoes = atualizaPosicoes(info)

    const tempoVolta = process.hrtime.bigint()
    const diff = tempoVolta - times[nomeV].tempoInicialVolta
    const diffConvertido = Number(diff) / 1e9
    
    info[nomeV].voltas.push(diffConvertido)

    times[nomeV].tempoInicialVolta = process.hrtime.bigint();

    if (diffConvertido < info[nomeV].melhorTempo) {
        info[nomeV].melhorTempo = diffConvertido
    }

    // res.send(String(info[nomeV].nVoltas), posicoes)
    res.send({
        nVoltas: info[nomeV].nVoltas,
        posicoes
    })
    fs.writeFile("dados.json", JSON.stringify(info, null, 2), "utf-8")
})

let interval
let comecou = 0 
app.get("/iniciar", (req, res) => {
    if (comecou){ 
        console.log("Ja comecou")
        return 0
    }
    inicio = process.hrtime.bigint()

    Object.entries(times).forEach((elem) => {
        elem[1].tempoInicialVolta = inicio
    })

    interval = setInterval(() => {
        const agora = process.hrtime.bigint()
        const diff = agora - inicio
    
        io.emit("tempo", Number(diff) / 1e9)
    
        Object.entries(times).forEach((elem) => {
            elem[1].tempoVolta = agora - elem[1].tempoInicialVolta
            io.emit("tempoTime", elem[0], Number(elem[1].tempoVolta) / 1e9)
        })
    }, 100)
    comecou = 1
})

app.get("/parar", (req, res) => {
    clearInterval(interval)
    comecou = 0
})
