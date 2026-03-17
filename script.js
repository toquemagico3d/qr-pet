let fotoBase64 = ""

document.getElementById("foto").addEventListener("change", function(){

let file = this.files[0]
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

function salvarPet(){

let nome = document.getElementById("nome").value
let tutor = document.getElementById("tutor").value
let telefone = document.getElementById("telefone").value.replace(/\D/g,"")

let id = Date.now()

let pet = {

id,
nome,
tutor,
telefone,
foto:fotoBase64

}

localStorage.setItem("pet_"+id,JSON.stringify(pet))

alert("Pet cadastrado!")

window.location="pet.html?id="+id

}
