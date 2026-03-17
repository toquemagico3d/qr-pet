// =========================
// CONFIG FIREBASE
// =========================
const firebaseConfig = {
  apiKey: "AIzaSyDm8_-__qUDqp34BGLCbaHks8wTGyj3krE",
  authDomain: "qr-pet-toque-magico.firebaseapp.com",
  projectId: "qr-pet-toque-magico"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// =========================
// CONFIG CLOUDINARY
// =========================
const CLOUD_NAME = "toque-magico-3d";
const UPLOAD_PRESET = "qrpet_upload";

// =========================
// UPLOAD IMAGEM
// =========================
async function uploadImagem(file){
  let formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  let res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData
  });

  let data = await res.json();
  return data.secure_url;
}

// =========================
// GERAR QR CODE
// =========================
function gerarQR(id){

  let link = `https://toquemagico3d.github.io/qr-pet/pet.html?id=${id}`;

  let qr = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&format=svg&data=${encodeURIComponent(link)}`;

  document.getElementById("qrcode").innerHTML = `
    <h3>QR Code:</h3>
    <img src="${qr}">
    <br>
    <a href="${qr}" download="qrcode.svg">⬇ Baixar SVG</a>
  `;
}

// =========================
// CADASTRAR PET
// =========================
async function cadastrar(){

  let nome = document.getElementById("nome").value;
  let tutor = document.getElementById("tutor").value;
  let telefone = document.getElementById("telefone").value.replace(/\D/g,"");
  let file = document.getElementById("foto").files[0];

  if(!nome || !tutor || !telefone || !file){
    alert("Preencha tudo!");
    return;
  }

  try{

    let fotoURL = await uploadImagem(file);

    let doc = await db.collection("pets").add({
      nome,
      tutor,
      telefone,
      foto: fotoURL
    });

    gerarQR(doc.id);

    alert("✅ Pet cadastrado!");

  }catch(e){
    alert("Erro: " + e.message);
  }

}

// =========================
// CARREGAR PET + BOTÕES
// =========================
if(window.location.pathname.includes("pet.html")){

  let id = new URLSearchParams(location.search).get("id");

  if(id){

    db.collection("pets").doc(id).get().then(doc=>{

      if(doc.exists){

        let pet = doc.data();

        document.getElementById("foto").src = pet.foto;
        document.getElementById("nome").innerText = pet.nome;
        document.getElementById("tutor").innerText = "Tutor: " + pet.tutor;

        document.getElementById("ligar").href = "tel:" + pet.telefone;

        // 🔥 BOTÃO WHATSAPP (VERSÃO GARANTIDA)
        setTimeout(() => {

          let btn = document.getElementById("zap");

          if(btn){

            btn.onclick = function(){

              let telefone = pet.telefone;

              function abrirWhats(msg){
                let url = `https://wa.me/55${telefone}?text=${encodeURIComponent(msg)}`;
                window.location.href = url;
              }

              if(navigator.geolocation){

                navigator.geolocation.getCurrentPosition(

                  function(pos){

                    let lat = pos.coords.latitude;
                    let lng = pos.coords.longitude;

                    let msg = `Encontrei seu pet ${pet.nome}!\n📍 https://maps.google.com/?q=${lat},${lng}`;

                    abrirWhats(msg);

                  },

                  function(){
                    abrirWhats(`Encontrei seu pet ${pet.nome}! (sem localização)`);
                  }

                );

              }else{
                abrirWhats(`Encontrei seu pet ${pet.nome}!`);
              }

            };

          }

        }, 500);

      }else{
        document.body.innerHTML = "<h2>Pet não encontrado</h2>";
      }

    });

  }

}
