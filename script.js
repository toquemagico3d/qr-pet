function salvarPet(){

let nome = document.getElementById("nome").value
let tutor = document.getElementById("tutor").value
let telefone = document.getElementById("telefone").value
let foto = document.getElementById("foto").value

let id = Date.now()

let pet = {
id,
nome,
tutor,
telefone,
foto
}

localStorage.setItem("pet_"+id,JSON.stringify(pet))

alert("Pet cadastrado!")

let link = "pet.html?id="+id

window.location = link

}
