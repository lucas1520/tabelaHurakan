const socket = io()

socket.on("tempo", (t) => {
    document.getElementById("tempoGeral").textContent = formatarTempo(t)
})

socket.on("tempoTime", (nome, tempo) => {
    // document.getElementById(`tempo_${nome}`).textContent = tempo

    document.getElementById(`tempo_${nome}`).textContent = formatarTempo(tempo)
})

const formatarTempo = (tempo) => {
    const horas = Math.floor(tempo / 3600)
    const minutos = Math.floor((tempo % 3600) / 60)
    const segundos = Math.floor(tempo % 60)
    const milissegundos = parseFloat((tempo % 1).toFixed(3)) * 1000

    const format = String(minutos).padStart(2, "0") + ":" +
        String(segundos).padStart(2, "0") + "." +
        String(milissegundos).padStart(3, "0")
    // return `${minutos}:${segundos}:${milissegundos}`
    return format
}

const construir = (nome, nVoltas) => {
    const container = document.createElement("div")

    nVoltas = String(nVoltas).padStart(2, "0")

    container.innerHTML = `
        <div style="border: 1px solid black;" class="time" onclick="adicionar('${nome}')">
            <span class="time__top">
                <h2>${nome}</h2>
                <p class="time__tempo" id=tempo_${nome}>00:00:00</p>
            </span>
            <hr class="separacao">
            <span class="time__bottom">
                <p id=volta_${nome} class="time__voltas">Voltas: ${nVoltas}</p>
                <button onclick="event.stopPropagation(); alert('foi')">-</button>
            </span>
        </div>
    `

    document.getElementById("list").append(container)

}

const adicionar = (nome) => {
    fetch(`/addVolta?nome=${encodeURIComponent(nome)}`).
        then((res) => {
            console.log(res)
            return res.json()
        }).
        then((resp) => {
            console.log(resp)
            document.getElementById("volta_" + nome).textContent = `Voltas: ${resp}`
        })
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
            construir(elem[0], elem[1].nVoltas)

        })
    })