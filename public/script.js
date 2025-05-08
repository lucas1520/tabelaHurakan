const socket = io()

socket.on("tempo", (t) => {
    document.getElementById("tempoGeral").textContent = formatarTempo(t)
})

socket.on("tempoTime", (nomeId, tempo) => {
    document.getElementById(`tempo_${nomeId}`).textContent = formatarTempo(tempo)
})

const formatarTempo = (tempo) => {
    const horas = Math.floor(tempo / 3600)
    const minutos = Math.floor((tempo % 3600) / 60)
    const segundos = Math.floor(tempo % 60)
    const milissegundos = parseFloat((tempo % 1).toFixed(3)) * 1000

    const format = String(minutos).padStart(2, "0") + ":" +
        String(segundos).padStart(2, "0") + "." +
        String(milissegundos).padStart(3, "0")

    return format
}

const construir = (nome, nVoltas, nomeId) => {
    const container = document.createElement("div")

    nVoltas = String(nVoltas).padStart(2, "0")

    container.innerHTML = `
        <div style="border: 1px solid black;" class="time" onclick="adicionar('${nomeId}')">
            <span class="time__top">
                <h2>${nome}</h2>
                <p class="time__tempo" id=tempo_${nomeId}>00:00:00</p>
            </span>
            <hr class="separacao">
            <span class="time__bottom">
                <p id=volta_${nomeId} class="time__voltas">Voltas: ${nVoltas}</p>
                <button onclick="event.stopPropagation(); alert('foi')">-</button>
            </span>
        </div>
    `

    document.getElementById("list").append(container)
}

const adicionar = (nomeId) => {
    fetch(`/addVolta?nome=${encodeURIComponent(nomeId)}`).
        then((res) => {
            console.log(res)
            return res.json()
        }).
        then((resp) => {
            console.log(resp)
            document.getElementById("volta_" + nomeId).textContent = `Voltas: ${String(resp.nVoltas).padStart(2, "0")}`
            let numero = 0
            let voltasAnterior = -9999
            document.getElementById("posicoes").innerHTML = ""
            resp.posicoes.forEach((elem) => {
                if (voltasAnterior != elem.nVoltas) {
                    numero++
                }
                let timePos = document.createElement("p")
                timePos.innerHTML = `
                    <p>${numero}. ${elem.nome}</p>
                `
                document.getElementById("posicoes").append(timePos)
                voltasAnterior = elem.nVoltas
            })
        })
}

const iniciar = () => {
    fetch("/iniciar")
}
const parar = () => {
    fetch("/parar")
}
fetch("/pegarDados").
    then((response) => {
        console.log(response)
        // Transforma a response em um objeto js
        return response.json()
    }).
    then((res) => {
        let a = Object.entries(res)
        console.log(a)
        a.forEach((elem) => {
            console.log(elem)
            construir(elem[1].nome, elem[1].nVoltas, elem[0])

        })
    })