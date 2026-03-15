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

    container.innerHTML = ""; 

    filtradas.forEach((q, index) => {
        const div = document.createElement("div");
        div.className = "card-questao"; 
        div.style.background = "#1e293b";
        div.style.padding = "25px";
        div.style.borderRadius = "12px";
        div.style.marginBottom = "30px";
        div.style.textAlign = "left";
        div.style.border = "1px solid #334155";

        // Tag de Imagem
        let imgTag = q.imagem ? `<img src="${q.imagem}" style="max-width:100%; border-radius:8px; margin-bottom:20px; display:block;">` : "";
        
        // Tag de Texto de Apoio (Opcional)
        let textoApoioTag = q.texto_apoio ? `
            <div style="background: #0f172a; border-left: 4px solid #38bdf8; padding: 15px; margin-bottom: 20px; font-style: italic; color: #cbd5e1; line-height: 1.6; border-radius: 0 8px 8px 0;">
                ${q.texto_apoio}
            </div>
        ` : "";

        // Tag de Resolução
        let resolucaoTag = q.resolucao ? `
            <div id="res-${q.id}" style="display:none; margin-top:15px; padding:15px; background:#0f172a; border-radius:8px; border-left: 4px solid #facc15;">
                <p style="color:#facc15; font-weight:bold; font-size:14px; margin:0 0 5px 0;">💡 Explicação:</p>
                <p style="color:#cbd5e1; font-size:14px; margin:0;">${q.resolucao}</p>
            </div>
        ` : "";

        div.innerHTML = `
            ${imgTag}
            ${textoApoioTag}
            <p style="font-weight:bold; margin-bottom:12px; color: #38bdf8; font-size: 1.1em;">Questão ${index + 1}:</p>
            <p style="margin-bottom:20px; line-height: 1.6; color: #f8fafc;">${q.pergunta}</p>
            
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <label style="display: flex; align-items: center; gap: 12px; background: #0f172a; padding: 12px; border-radius: 8px; cursor: pointer; border: 1px solid transparent; transition: 0.2s;" onmouseover="this.style.borderColor='#38bdf8'" onmouseout="this.style.borderColor='transparent'">
                    <input type="radio" name="q${q.id}" value="a" style="cursor:pointer;"> <span>A) ${q.a}</span>
                </label>
                <label style="display: flex; align-items: center; gap: 12px; background: #0f172a; padding: 12px; border-radius: 8px; cursor: pointer; border: 1px solid transparent; transition: 0.2s;" onmouseover="this.style.borderColor='#38bdf8'" onmouseout="this.style.borderColor='transparent'">
                    <input type="radio" name="q${q.id}" value="b" style="cursor:pointer;"> <span>B) ${q.b}</span>
                </label>
                <label style="display: flex; align-items: center; gap: 12px; background: #0f172a; padding: 12px; border-radius: 8px; cursor: pointer; border: 1px solid transparent; transition: 0.2s;" onmouseover="this.style.borderColor='#38bdf8'" onmouseout="this.style.borderColor='transparent'">
                    <input type="radio" name="q${q.id}" value="c" style="cursor:pointer;"> <span>C) ${q.c}</span>
                </label>
                <label style="display: flex; align-items: center; gap: 12px; background: #0f172a; padding: 12px; border-radius: 8px; cursor: pointer; border: 1px solid transparent; transition: 0.2s;" onmouseover="this.style.borderColor='#38bdf8'" onmouseout="this.style.borderColor='transparent'">
                    <input type="radio" name="q${q.id}" value="d" style="cursor:pointer;"> <span>D) ${q.d}</span>
                </label>
            </div>

            <button onclick="verificarResposta('${q.id}', '${q.correta}')" style="margin-top:25px; width: 100%; padding: 15px; background:#22c55e; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; font-size: 16px; transition: 0.3s;">Confirmar Leitura e Responder</button>
            <p id="msg-${q.id}" style="margin-top:15px; font-weight:bold; text-align: center;"></p>
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
        alert("Por favor, selecione uma alternativa antes de confirmar!");
        return;
    }

    if (selecionada.value === correta) {
        msg.innerText = "✅ Excelente! Você acertou.";
        msg.style.color = "#22c55e";
        contabilizarAcerto();
    } else {
        msg.innerText = `❌ Não foi dessa vez. A resposta correta era a (${correta.toUpperCase()})`;
        msg.style.color = "#ef4444";
    }

    if (resDiv) resDiv.style.display = "block"; 
}

function contabilizarAcerto() {
    const user = localStorage.getItem("logado");
    if (user) {
        let dados = JSON.parse(localStorage.getItem(user));
        dados.respondidas = (dados.respondidas || 0) + 1;
        // Aqui você pode adicionar lógica de XP: dados.xp = (dados.xp || 0) + 10;
        localStorage.setItem(user, JSON.stringify(dados));
    }
}