import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCqMEbG7Uf03vNmEcIQa3uZhjV2npiw0_w",
    authDomain: "mundo-cavest.firebaseapp.com",
    projectId: "mundo-cavest",
    storageBucket: "mundo-cavest.firebasestorage.app",
    messagingSenderId: "386396770156",
    appId: "1:386396770156:web:2c506fdb989e4c15e6ad49"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function carregarQuestoes(materia, assunto) {
    const container = document.getElementById("container-questoes");
    if (!container) return;

    container.innerHTML = "<p style='color: #38bdf8; text-align: center;'>Consultando a nuvem do Mundo CAVEST...</p>";

    try {
        const qRef = collection(db, "questoes");
        const consulta = query(qRef, where("materia", "==", materia), where("assunto", "==", assunto));
        const querySnapshot = await getDocs(consulta);

        if (querySnapshot.empty) {
            container.innerHTML = "<p style='color: #94a3b8; text-align: center;'>Nenhuma questão disponível para este assunto ainda.</p>";
            return;
        }

        container.innerHTML = ""; 
        let contador = 1;

        querySnapshot.forEach((docSnap) => {
            const q = docSnap.data();
            const idDoc = docSnap.id;
            const div = document.createElement("div");
            div.className = "card-questao"; 
            div.style.cssText = "background: #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 30px; text-align: left; border: 1px solid #334155; position: relative; color: white;";

            let imgTag = q.imagem ? `<img src="${q.imagem}" style="max-width:100%; border-radius:8px; margin-bottom:20px; display:block;">` : "";
            let textoApoioTag = q.texto_apoio ? `<div style="background: #0f172a; border-left: 4px solid #38bdf8; padding: 15px; margin-bottom: 20px; font-style: italic; color: #cbd5e1; line-height: 1.6; border-radius: 0 8px 8px 0;">${q.texto_apoio}</div>` : "";
            let resolucaoTag = q.resolucao ? `<div id="res-${idDoc}" style="display:none; margin-top:15px; padding:15px; background:#0f172a; border-radius:8px; border-left: 4px solid #facc15;"><p style="color:#facc15; font-weight:bold; font-size:14px; margin:0 0 5px 0;">💡 Explicação:</p><p style="color:#cbd5e1; font-size:14px; margin:0;">${q.resolucao}</p></div>` : "";

            div.innerHTML = `
                ${imgTag}
                ${textoApoioTag}
                <p style="font-weight:bold; margin-bottom:12px; color: #38bdf8; font-size: 1.1em;">Questão ${contador}:</p>
                <p style="margin-bottom:20px; line-height: 1.6; color: #f8fafc;">${q.pergunta}</p>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${['a', 'b', 'c', 'd'].map(opt => `
                        <label style="display: flex; align-items: center; gap: 12px; background: #0f172a; padding: 12px; border-radius: 8px; cursor: pointer; border: 1px solid transparent; transition: 0.2s;">
                            <input type="radio" name="q${idDoc}" value="${opt}" style="cursor:pointer;"> <span>${opt.toUpperCase()}) ${q[opt]}</span>
                        </label>
                    `).join('')}
                </div>
                <button onclick="verificarResposta('${idDoc}', '${q.correta}')" style="margin-top:25px; width: 100%; padding: 15px; background:#22c55e; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; font-size: 16px;">Confirmar Resposta</button>
                <p id="msg-${idDoc}" style="margin-top:15px; font-weight:bold; text-align: center;"></p>
                ${resolucaoTag}
            `;
            container.appendChild(div);
            contador++;
        });
    } catch (erro) {
        container.innerHTML = "<p style='color: #ef4444; text-align: center;'>Erro ao conectar com o servidor.</p>";
    }
}

window.verificarResposta = (id, correta) => {
    const selecionada = document.querySelector(`input[name="q${id}"]:checked`);
    const msg = document.getElementById(`msg-${id}`);
    const resDiv = document.getElementById(`res-${id}`);
    if (!selecionada) { alert("Selecione uma alternativa!"); return; }
    if (selecionada.value === correta) {
        msg.innerText = "✅ Excelente! Você acertou.";
        msg.style.color = "#22c55e";
    } else {
        msg.innerText = `❌ Incorreto. A resposta certa era (${correta.toUpperCase()})`;
        msg.style.color = "#ef4444";
    }
    if (resDiv) resDiv.style.display = "block"; 
};

window.carregarQuestoes = carregarQuestoes;