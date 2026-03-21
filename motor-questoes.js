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

// --- FUNÇÃO MÁGICA DE FORMATAÇÃO ---
function autoFormatar(texto) {
    if (!texto) return "";
    // Converte x^y em formato matemático visual
    return texto.replace(/([a-zA-Z0-9]+)\^([a-zA-Z0-9\-]+)/g, "\\( $1^{$2} \\)");
}

function converterLinkDrive(link) {
    if (!link) return "";
    if (link.includes("drive.google.com")) {
        let id = "";
        try {
            if (link.includes("id=")) {
                id = link.split("id=")[1].split("&")[0];
            } else {
                id = link.split("/d/")[1].split("/")[0];
            }
            return `https://lh3.googleusercontent.com/u/0/d/${id}`;
        } catch (e) {
            return link;
        }
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
            questaoDiv.style = "background:#1e293b; padding:20px; border-radius:12px; margin-bottom:20px; border: 1px solid rgba(255,255,255,0.05);";

            // Aplicando a formatação em todos os campos de texto
            const textoApoio = autoFormatar(data.textoApoio);
            const pergunta = autoFormatar(data.pergunta);
            const optA = autoFormatar(data.a);
            const optB = autoFormatar(data.b);
            const optC = autoFormatar(data.c);
            const optD = autoFormatar(data.d);
            const resolucao = autoFormatar(data.resolucao);

            const htmlApoio = textoApoio ? `<div class="texto-apoio" style="color:#94a3b8; font-style:italic; margin-bottom:10px;">${textoApoio}</div>` : "";
            
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
                <button class="btn-resolucao" onclick="mostrarResolucao(this)" style="margin-top:15px; background:#fbbf24; color:#0f172a; border:none; padding:8px 15px; border-radius:6px; font-weight:bold; cursor:pointer;">Ver Resolução</button>
                <div class="resolucao-box" style="display:none; margin-top:15px; padding:15px; background:#0f172a; border:1px dashed #fbbf24; border-radius:8px; color:#fbbf24;">
                    <strong>💡 Resolução:</strong><br>${resolucao}
                </div>
            ` : "";

            questaoDiv.innerHTML = `
                <span style="color:#38bdf8; font-weight:bold;">Questão ${contador}</span>
                <hr style="border:0; border-top:1px solid #334155; margin:10px 0;">
                ${htmlApoio}
                ${htmlImagem}
                <p class="enunciado" style="font-size:17px; line-height:1.6; margin-bottom:20px;">${pergunta}</p>
                <div class="alternativas" style="display:flex; flex-direction:column; gap:10px;">
                    <button class="alt-btn" onclick="verificar(this, '${data.correta}', 'a')" style="text-align:left; padding:12px; border-radius:8px; background:#334155; border:1px solid #475569; color:white; cursor:pointer;">A) ${optA}</button>
                    <button class="alt-btn" onclick="verificar(this, '${data.correta}', 'b')" style="text-align:left; padding:12px; border-radius:8px; background:#334155; border:1px solid #475569; color:white; cursor:pointer;">B) ${optB}</button>
                    <button class="alt-btn" onclick="verificar(this, '${data.correta}', 'c')" style="text-align:left; padding:12px; border-radius:8px; background:#334155; border:1px solid #475569; color:white; cursor:pointer;">C) ${optC}</button>
                    <button class="alt-btn" onclick="verificar(this, '${data.correta}', 'd')" style="text-align:left; padding:12px; border-radius:8px; background:#334155; border:1px solid #475569; color:white; cursor:pointer;">D) ${optD}</button>
                </div>
                ${htmlResolucao}
            `;
            container.appendChild(questaoDiv);
            contador++;
        });

        // DISPARA O MATHJAX PARA RENDERIZAR TUDO
        if (window.MathJax) {
            window.MathJax.typesetPromise();
        }

    } catch (e) {
        console.error("Erro Firebase:", e);
        container.innerHTML = "<p>Erro ao conectar com o banco de dados.</p>";
    }
};

// ... (Restante das funções verificar e mostrarResolucao iguais)