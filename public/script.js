const socket = io()

socket.on("tempo", (t) => {
    document.getElementById("tempoGeral").textContent = t
})

socket.on("tempoTime", (nome, tempo) => {
    document.getElementById(`tempo_${nome}`).textContent = tempo
})

const construir = (nome, nVoltas) => {
    const container = document.createElement("div")

    container.innerHTML = `
        <div style="border: 1px solid black;" class="time" onclick="adicionar('${nome}')">
            <span class="top">
                <h2>${nome}</h2>
                <p class="tempo" id=tempo_${nome}>00:00:00</p>
            </span>
            <hr class="separacao">
            <span class="bottom">
                <p id=volta_${nome} class="voltas">Voltas: ${nVoltas}</p>
                <button onclick="event.stopPropagation(); alert('foi')">-</button>
            </span>
        </div>
    `

    document.getElementById("list").append(container)

}

const colocar = (nome, nVoltas) => {
    const divNome = document.getElementById("nome").textContent = nome
    const divVoltas = document.getElementById("voltas").textContent = nVoltas
}

const adicionar = (nome) => {
    // alert(nome)
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