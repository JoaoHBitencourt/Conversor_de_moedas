const dropList = document.querySelectorAll(".drop-list select"),
    fromCurency = document.querySelector(".from select"),
    toCurrency = document.querySelector(".to select"),
    getButton = document.querySelector("form button")

for (let i = 0; i < dropList.length; i++) { // Selecionar o USD como padrão .from e BRL como .to
    for (code in country_code) {
        let select
        if (i == 0) {
            select = code == "USD" ? "selected" : ''
        } else if (i == 1) {
            select = code == "BRL" ? "selected" : ''
        }

        let optionTag = `<option value="${code}" ${select}>${code}</option>` // Tag q sera criada no dentro do <select/>
        dropList[i].insertAdjacentHTML("beforeend", optionTag)// Inserindo a Tag
    }
    dropList[i].addEventListener("change", e => {// Chamando loadFlag com a passagem do elemento de destino
        loadFlag(e.target)
    })
}

function loadFlag(element) {
    for (code in country_code) {
        if (code == element.value) { // Testar se o codigo da moeda do Pais selecionado e igual o valor da opção
            let imgTag = element.parentElement.querySelector("img") // Selecionando a Tag img do HTML
            imgTag.src = `https://flagcdn.com/48x36/${country_code[code].toLowerCase()}.png`
        }
    }
}

window.addEventListener("onload", () => {
    getExchangeRate()
})

getButton.addEventListener("click", e => {
    e.preventDefault()
    getExchangeRate()
})

const exchangeIcon = document.querySelector(".drop-list .icon")
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurency.value
    fromCurency.value = toCurrency.value
    toCurrency.value = tempCode
    loadFlag(fromCurency)
    loadFlag(toCurrency)
    getExchangeRate()
})

function getExchangeRate() {
    const amount = document.querySelector(".amount input")
    const exchangeRateTxt = document.querySelector(".exchange-rate")
    let amountVal = amount.value
    if (amountVal == "" || amountVal == "0") {// Seta 1 como valor padrão
        amount.value = "1"
        amountVal = 1
    }
    exchangeRateTxt.innerText = "Obtendo Taxa de Câmbio..."
    let url = `https://v6.exchangerate-api.com/v6/YourAPIkey/latest/${fromCurency.value}`
    fetch(url)
        .then(resp => resp.json()) // Buscando resposta da API e retornado o valor encontrado
        .then(result => {
            let exchangerate = result.conversion_rates[toCurrency.value]
            let totalExchangeRate = (amountVal * exchangerate).toFixed(2)
            exchangeRateTxt.innerText = `${amountVal} ${fromCurency.value} = ${totalExchangeRate} ${toCurrency.value}`
        }).catch(() => {
            exchangeRateTxt.innerText = "Algo deu errado"
        })
}