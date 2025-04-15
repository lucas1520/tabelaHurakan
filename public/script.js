const construir = (nome, nVoltas) => {
    const container = document.createElement("div")

    container.innerHTML = `
        <div style="border: 1px solid black;">
            ${nome}
            <div>
                <p id=${nome}>Voltas: ${nVoltas}</p>
            </div>
            <button onclick=adicionar('${nome}')>+</button>
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
            document.getElementById(nome).textContent = `Voltas: ${resp}`
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