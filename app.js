let fotoBase64 = ""

document.getElementById("foto").addEventListener("change", function(){

let reader = new FileReader()

reader.onload = e => {
fotoBase64 = e.target.result
document.getElementById("preview").src = fotoBase64
}

reader.readAsDataURL(this.files[0])

})

// máscara telefone
document.getElementById("telefone").addEventListener("input", function(e){

let v = e.target.value.replace(/\D/g,"")

v = v.replace(/^(\d{2})(\d)/g,"($1) $2")
v = v.replace(/(\d{5})(\d)/,"$1-$2")

e.target.value = v

})

function cadastrar(){

let id = Date.now()

let pet = {
id,
nome: nome.value,
tutor: tutor.value,
telefone: telefone.value.replace(/\D/g,""),
foto: fotoBase64
}

localStorage.setItem("pet_"+id, JSON.stringify(pet))

render()

gerarQR(id)

}

function render(){

let lista = document.getElementById("lista")
lista.innerHTML = ""

for(let key in localStorage){

if(key.startsWith("pet_")){

let pet = JSON.parse(localStorage.getItem(key))

lista.innerHTML += `
<div class="card">
<img src="${pet.foto}" class="pet-img">
<p>${pet.nome}</p>
<a href="pet.html?id=${pet.id}" target="_blank">Abrir</a>
</div>
`

}

}

}

function gerarQR(id){

let link = location.origin + location.pathname.replace("index.html","") + "pet.html?id="+id

alert("Link do Pet:\n"+link+"\n\nUse esse link no QR Code")

}

render()
