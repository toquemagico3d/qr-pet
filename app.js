let fotoBase64 = ""

// upload imagem
document.getElementById("foto").addEventListener("change", function(){

let file = this.files[0]
if(!file) return

let reader = new FileReader()

reader.onload = function(e){
fotoBase64 = e.target.result
document.getElementById("preview").src = fotoBase64
}

reader.readAsDataURL(file)

})

// máscara telefone
document.getElementById("telefone").addEventListener("input", function(e){

let v = e.target.value.replace(/\D/g,"")

v = v.replace(/^(\d{2})(\d)/g,"($1) $2")
v = v.replace(/(\d{5})(\d)/,"$1-$2")

e.target.value = v

})

// cadastrar
function cadastrar(){

let nome = document.getElementById("nome").value
let tutor = document.getElementById("tutor").value
let telefone = document.getElementById("telefone").value.replace(/\D/g,"")

if(!nome || !tutor || !telefone || !fotoBase64){
alert("Preencha todos os campos!")
return
}

let id = Date.now()

let pet = {
id,
nome,
tutor,
telefone,
foto: fotoBase64
}

localStorage.setItem("pet_"+id, JSON.stringify(pet))

render()

alert("Pet cadastrado com sucesso!")

}

// listar pets
function render(){

let lista = document.getElementById("lista")
lista.innerHTML = ""

for(let key in localStorage){

if(key.startsWith("pet_")){

let pet = JSON.parse(localStorage.getItem(key))

lista.innerHTML += `
<div class="card">

<img src="${pet.foto}" class="pet-img">

<p><b>${pet.nome}</b></p>

<button onclick="abrirPet(${pet.id})">👁 Ver</button>

<button onclick="gerarQR(${pet.id})">🏷 QR SVG</button>

</div>
`

}

}

}

// abrir página do pet
function abrirPet(id){

let link = "https://toquemagico3d.github.io/qr-pet/pet.html?id=" + id

window.open(link, "_blank")

}

// gerar QR SVG
function gerarQR(id){

let link = "https://toquemagico3d.github.io/qr-pet/pet.html?id=" + id

let qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=500x500&format=svg&data=" + encodeURIComponent(link)

// download automático
let a = document.createElement("a")
a.href = qrUrl
a.download = "qr_pet_"+id+".svg"
document.body.appendChild(a)
a.click()
document.body.removeChild(a)

}

render()
