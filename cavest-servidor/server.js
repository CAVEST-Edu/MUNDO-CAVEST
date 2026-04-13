const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
app.use(cors());
app.use(express.json());

// Mudança importante: O servidor vai buscar a chave nas configurações do Render
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/corrigir", async (req, res) => {
    const { redacao, tema } = req.body;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Você é um corretor especialista da banca do ENEM. 
                    Sua função é avaliar a redação com base nas 5 competências oficiais (200 pontos cada).
                    Seja criterioso com a norma culta e verifique se há uma proposta de intervenção completa.
                    Importante: Avalie se o texto respeita o tema proposto: "${tema}".`
                },
                {
                    role: "user",
                    content: `Analise a redação abaixo, que foi escrita sobre o tema: "${tema}".
                    Use EXATAMENTE este formato Markdown para a resposta:

# 📊 Resultado da Correção
(Dê a nota final de 0 a 1000 aqui)

---

### 📝 Notas por Competência
1. **Domínio da norma culta:** (Nota 0-200)
2. **Compreensão do tema:** (Nota 0-200)
3. **Organização das informações:** (Nota 0-200)
4. **Conhecimento linguístico:** (Nota 0-200)
5. **Proposta de intervenção:** (Nota 0-200)

---

### ✅ Pontos Fortes
(Destaque o que o aluno acertou)

### ⚠️ Pontos Fracos e Erros
(Aponte falhas gramaticais e de estruturação)

### 💡 Sugestões de Melhoria
(Dê exemplos de como subir a nota)

Redação:
${redacao}`
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
        });

        res.json({ resposta: completion.choices[0].message.content });

    } catch (erro) {
        console.error("ERRO:", erro);
        res.status(500).json({ erro: "Falha na comunicação com a IA." });
    }
});

// Isso permite que o Render escolha a porta que ele quiser
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Mundo CAVEST rodando na porta ${PORT}`);
});