// CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDm8_-__qUDqp34BGLCbaHks8wTGyj3krE",
  authDomain: "qr-pet-toque-magico.firebaseapp.com",
  projectId: "qr-pet-toque-magico"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// CONFIG CLOUDINARY
const CLOUD_NAME = "toque-magico-3d";
const UPLOAD_PRESET = "qrpet_upload";

// UPLOAD IMAGEM
async function uploadImagem(file){
  let formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  let res = await fetch(`https://api.cloudinary.com/v1_1/${toque-magico-3d}/image/upload`, {
    method: "POST",
    body: formData
  });

  let data = await res.json();
  return data.secure_url;
}

// CADASTRAR PET
async function cadastrar(){

let nome = document.getElementById("nome").value;
let tutor = document.getElementById("tutor").value;
let telefone = document.getElementById("telefone").value.replace(/\D/g,"");
let file = document.getElementById("foto").files[0];

if(!file){
alert("Envie a foto");
return;
}

// upload imagem
let fotoURL = await uploadImagem(file);

// salvar no firestore
let doc = await db.collection("pets").add({
nome,
tutor,
telefone,
foto: fotoURL
});

// gerar QR
gerarQR(doc.id);

alert("Pet cadastrado com sucesso!");

}

// GERAR QR SVG
function gerarQR(id){

let link = `https://toquemagico3d.github.io/qr-pet/pet.html?id=${id}`;

let qr = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&format=svg&data=${encodeURIComponent(link)}`;

document.getElementById("qrcode").innerHTML =
`<p>QR Code:</p>
<img src="${qr}">
<br>
<a href="${qr}" download="qrcode.svg">⬇ Baixar SVG</a>`;

}

// CARREGAR PET
if(window.location.pathname.includes("pet.html")){

let id = new URLSearchParams(window.location.search).get("id");

db.collection("pets").doc(id).get().then(doc=>{

let pet = doc.data();

document.getElementById("foto").src = pet.foto;
document.getElementById("nome").innerText = pet.nome;
document.getElementById("tutor").innerText = "Tutor: "+pet.tutor;

document.getElementById("ligar").href = "tel:"+pet.telefone;

document.getElementById("zap").href =
"https://wa.me/55"+pet.telefone+
"?text=Encontrei seu pet "+pet.nome;

});

}
