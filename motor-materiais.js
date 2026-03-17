import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

export async function carregarMateriais(materia) {
    const container = document.getElementById("lista-materiais");
    if (!container) return;

    container.innerHTML = "<p>Buscando materiais...</p>";

    try {
        const q = query(
            collection(db, "materiais"), 
            where("materia", "==", materia),
            orderBy("criadoEm", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            container.innerHTML = "<p>Nenhum material postado para esta disciplina.</p>";
            return;
        }

        container.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const item = doc.data();
            const card = document.createElement("div");
            card.className = "material-card";
            card.innerHTML = `
                <div style="background: #1e293b; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 5px solid #38bdf8; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: bold; font-size: 18px;">📘 ${item.nome}</span>
                    <a href="${item.link}" target="_blank" style="background: #38bdf8; color: #0f172a; padding: 8px 15px; border-radius: 5px; text-decoration: none; font-weight: bold;">BAIXAR PDF</a>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        container.innerHTML = "<p>Erro ao carregar materiais.</p>";
        console.error(e);
    }
}