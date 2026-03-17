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

                    let msg = `🐶 PET ENCONTRADO!

                    Olá! Encontrei o pet *${pet.nome}*.

                    📍 Localização:https://maps.google.com/?q=${lat},${lng}

                    Por favor entre em contato o quanto antes 🙏`;
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
    // =========================
// 🧑‍💻 PAINEL ADMIN
// =========================
if(window.location.pathname.includes("admin.html")){

  let lista = document.getElementById("lista");

  db.collection("pets").onSnapshot(snapshot=>{

    lista.innerHTML = "";

    snapshot.forEach(doc=>{

      let pet = doc.data();

      let div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <img src="${pet.foto}">
        <h3>${pet.nome}</h3>
        <p>${pet.tutor}</p>

        <button class="qr" onclick="reemitirQR('${doc.id}')">🏷 QR</button>
        <button class="editar" onclick="editarPet('${doc.id}','${pet.nome}','${pet.tutor}','${pet.telefone}')">✏️ Editar</button>
        <button class="excluir" onclick="excluirPet('${doc.id}')">❌ Excluir</button>
      `;

      lista.appendChild(div);

    });

  });

}

// =========================
// EXCLUIR
// =========================
function excluirPet(id){
  if(confirm("Excluir pet?")){
    db.collection("pets").doc(id).delete();
  }
}

// =========================
// EDITAR
// =========================
function editarPet(id, nome, tutor, telefone){

  let novoNome = prompt("Nome:", nome);
  let novoTutor = prompt("Tutor:", tutor);
  let novoTel = prompt("Telefone:", telefone);

  if(novoNome && novoTutor && novoTel){

    db.collection("pets").doc(id).update({
      nome: novoNome,
      tutor: novoTutor,
      telefone: novoTel
    });

  }

}

// =========================
// REEMITIR QR
// =========================
function reemitirQR(id){

  let link = `https://toquemagico3d.github.io/qr-pet/pet.html?id=${id}`;

  let qr = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&format=svg&data=${encodeURIComponent(link)}`;

  let win = window.open("");
  win.document.write(`
    <h2>QR Code</h2>
    <img src="${qr}">
    <br><br>
    <a href="${qr}" download="qrcode.svg">⬇ Baixar SVG</a>
  `);

}

  }

}
