import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCqMEbG7Uf03vNmEcIQa3uZhjV2npiw0_w",
    authDomain: "mundo-cavest.firebaseapp.com",
    projectId: "mundo-cavest",
    storageBucket: "mundo-cavest.appspot.com",
    messagingSenderId: "386396770156",
    appId: "1:386396770156:web:2c506fdb989e4c15e6ad49"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função mágica para o Biu não se preocupar com link do Drive
function converterLinkDrive(link) {
    if (link.includes("drive.google.com")) {
        let id = "";
        if (link.includes("id=")) {
            id = link.split("id=")[1].split("&")[0];
        } else {
            id = link.split("/d/")[1].split("/")[0];
        }
        return `https://lh3.googleusercontent.com/u/0/d/${id}`;
    }
    return link;
}

window.carregarQuestoes = async function(materia, assunto) {
    const container = document.getElementById("container-questoes");
    
    try {
        const q = query(
            collection(db, "questoes"),
            where("materia", "==", materia),
            where("assunto", "==", assunto)
        );

        const querySnapshot = await getDocs(q);
        container.innerHTML = "";

        if (querySnapshot.empty) {
            container.innerHTML = "<p style='text-align:center;'>Nenhuma questão encontrada.</p>";
            return;
        }

        let contador = 1;
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const questaoDiv = document.createElement("div");
            questaoDiv.className = "card-questao";

            const htmlApoio = data.textoApoio ? `<div class="texto-apoio">${data.textoApoio}</div>` : "";
            
            // Tratamento da Imagem com conversão automática
            let htmlImagem = "";
            if (data.imagem && data.imagem.trim() !== "") {
                const linkDireto = converterLinkDrive(data.imagem);
                htmlImagem = `
                    <div style="text-align:center; margin: 15px 0;">
                        <img src="${linkDireto}" 
                             style="max-width:100%; border-radius:8px; border: 1px solid #334155;" 
                             onerror="this.parentElement.style.display='none'">
                    </div>`;
            }

            const htmlResolucao = data.resolucao ? `
                <button class="btn-resolucao" onclick="mostrarResolucao(this)">Ver Resolução</button>
                <div class="resolucao-box" style="display:none; margin-top:15px; padding:15px; background:#0f172a; border:1px dashed #fbbf24; border-radius:8px; color:#fbbf24;">
                    <strong>💡 Resolução:</strong><br>${data.resolucao}
                </div>
            ` : "";

            questaoDiv.innerHTML = `
                <span style="color:#38bdf8; font-weight:bold;">Questão ${contador}</span>
                <hr style="border:0; border-top:1px solid #334155; margin:10px 0;">
                ${htmlApoio}
                ${htmlImagem}
                <p class="enunciado">${data.pergunta}</p>
                <div class="alternativas" style="display:flex; flex-direction:column; gap:10px;">
                    <button class="alt-btn" onclick="verificar(this, '${data.correta}', 'a')">A) ${data.a}</button>
                    <button class="alt-btn" onclick="verificar(this, '${data.correta}', 'b')">B) ${data.b}</button>
                    <button class="alt-btn" onclick="verificar(this, '${data.correta}', 'c')">C) ${data.c}</button>
                    <button class="alt-btn" onclick="verificar(this, '${data.correta}', 'd')">D) ${data.d}</button>
                </div>
                ${htmlResolucao}
            `;
            container.appendChild(questaoDiv);
            contador++;
        });

        if (window.MathJax) window.MathJax.typeset();

    } catch (e) {
        console.error("Erro Firebase:", e);
        container.innerHTML = "<p>Erro ao conectar com o banco de dados.</p>";
    }
};

window.mostrarResolucao = function(btn) {
    btn.nextElementSibling.style.display = 'block';
    btn.style.display = 'none';
};

window.verificar = function(btn, correta, escolhida) {
    const pai = btn.parentElement;
    const botoes = pai.querySelectorAll('.alt-btn');
    botoes.forEach(b => b.disabled = true);

    if (escolhida === correta) {
        btn.style.background = "#22c55e";
        btn.style.borderColor = "#22c55e";
    } else {
        btn.style.background = "#ef4444";
        btn.style.borderColor = "#ef4444";
        botoes.forEach(b => {
            if (b.innerText.toLowerCase().startsWith(correta)) {
                b.style.border = "2px solid #22c55e";
            }
        });
    }
};