const construir = (nome) => {
    const nomeElem = document.createElement("p").textContent = nome
    const div = document.createElement("div")
    div.append(nomeElem)
    div.style.border = "1px solid black"
    document.getElementById("list").append(div)
}

fetch("/pegarDados").
    then((response) => {
        return response.json()
    }).
    then((responseTratada) => {
        Object.values(responseTratada).forEach((elem) => {
            console.log(elem)
            construir(elem.nome)
        })
    })