// Função que carrega as questões baseada na matéria e no assunto da página
function carregarQuestoes(materia, assunto) {
    const container = document.getElementById("container-questoes");
    if (!container) return;

    const banco = JSON.parse(localStorage.getItem("bancoQuestoes")) || [];
    
    // Filtra as questões do banco
    const filtradas = banco.filter(q => q.materia === materia && q.assunto === assunto);

    if (filtradas.length === 0) {
        container.innerHTML = "<p style='color: #94a3b8; text-align: center;'>Nenhuma questão disponível para este assunto ainda.</p>";
        return;
    }

    container.innerHTML = ""; // Limpa o container antes de carregar

    filtradas.forEach((q, index) => {
        const div = document.createElement("div");
        div.className = "card-questao"; // Usa a classe que já tens no teu CSS
        div.style.background = "#1e293b";
        div.style.padding = "20px";
        div.style.borderRadius = "12px";
        div.style.marginBottom = "20px";
        div.style.textAlign = "left";

        let imgTag = q.imagem ? `<img src="${q.imagem}" style="max-width:100%; border-radius:8px; margin-bottom:15px; display:block;">` : "";
        
        let resolucaoTag = q.resolucao ? `
            <div id="res-${q.id}" style="display:none; margin-top:15px; padding:15px; background:#0f172a; border-radius:8px; border-left: 4px solid #facc15;">
                <p style="color:#facc15; font-weight:bold; font-size:14px;">💡 Explicação:</p>
                <p style="color:#cbd5e1; font-size:14px;">${q.resolucao}</p>
            </div>
        ` : "";

        div.innerHTML = `
            ${imgTag}
            <p style="font-weight:bold; margin-bottom:15px;">Questão ${index + 1}:</p>
            <p style="margin-bottom:20px;">${q.pergunta}</p>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <label><input type="radio" name="q${q.id}" value="a"> A) ${q.a}</label>
                <label><input type="radio" name="q${q.id}" value="b"> B) ${q.b}</label>
                <label><input type="radio" name="q${q.id}" value="c"> C) ${q.c}</label>
                <label><input type="radio" name="q${q.id}" value="d"> D) ${q.d}</label>
            </div>
            <button onclick="verificarResposta('${q.id}', '${q.correta}')" style="margin-top:20px; padding:10px 20px; background:#22c55e; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">Responder</button>
            <p id="msg-${q.id}" style="margin-top:10px; font-weight:bold;"></p>
            ${resolucaoTag}
        `;
        container.appendChild(div);
    });
}

function verificarResposta(id, correta) {
    const selecionada = document.querySelector(`input[name="q${id}"]:checked`);
    const msg = document.getElementById(`msg-${id}`);
    const resDiv = document.getElementById(`res-${id}`);

    if (!selecionada) {
        alert("Selecione uma opção!");
        return;
    }

    if (selecionada.value === correta) {
        msg.innerText = "✅ Correto!";
        msg.style.color = "#22c55e";
        contabilizarAcerto();
    } else {
        msg.innerText = `❌ Errado! A resposta era (${correta.toUpperCase()})`;
        msg.style.color = "#ef4444";
    }

    if (resDiv) resDiv.style.display = "block"; // Mostra a resolução se existir
}

function contabilizarAcerto() {
    const user = localStorage.getItem("logado");
    if (user) {
        let dados = JSON.parse(localStorage.getItem(user));
        dados.respondidas = (dados.respondidas || 0) + 1;
        localStorage.setItem(user, JSON.stringify(dados));
    }
}