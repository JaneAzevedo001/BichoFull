// backend/src/seeds/seedAnimals.js
import sequelize from "../config/database.js";
import "../models/GroupNumber.js";
import Animal from "../models/Animal.js";
import GroupNumber from "../models/GroupNumber.js";

// Lista dos 25 animais
const animais = [
  "Avestruz", "Águia", "Burro", "Borboleta", "Cachorro",
  "Cabra", "Carneiro", "Camelo", "Cobra", "Coelho",
  "Cavalo", "Elefante", "Galo", "Gato", "Jacaré",
  "Leão", "Macaco", "Porco", "Pavão", "Peru",
  "Touro", "Tigre", "Urso", "Veado", "Vaca"
];

// Função para gerar as 4 dezenas corretas para cada grupo
const gerarDezenas = (grupo) => {
  if (grupo < 1 || grupo > 25) return [];
  
  const inicio = (grupo - 1) * 4 + 1;
  
  return Array.from({ length: 4 }, (_, i) => {
    const num = inicio + i;
    // 100 vira "00" apenas no grupo 25
    return num === 100 ? "00" : String(num).padStart(2, '0');
  });
};

// Função para normalizar nome do animal (remover acentos para nome do arquivo SVG)
const normalizarNome = (nome) => {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
};

async function seed() {
  const transaction = await sequelize.transaction();
  
  try {
    // Cria tabelas se não existirem (sem apagar dados existentes)
    await sequelize.sync();
    
    const count = await Animal.count();
    if (count > 0) {
      console.log(`Já existem ${count} animais no banco. Seed ignorado.`);
      console.log("Dica: Use 'force: true' no sync() para recriar as tabelas (CUIDADO: apaga dados!)");
      process.exit(0);
    }

    console.log("Iniciando seed de animais...");
    
    for (let i = 0; i < animais.length; i++) {
      const grupo = i + 1;
      const nome = animais[i];
      
      // Cria o animal
      const novoAnimal = await Animal.create({
        group_number: grupo,
        animal_name: nome,
      }, { transaction });

      // Cria as 4 dezenas associadas
      const dezenas = gerarDezenas(grupo);
      for (const dezena of dezenas) {
        await GroupNumber.create({
          number: dezena,
          animal_id: novoAnimal.id,
        }, { transaction });
      }

      console.log(`  ✓ Grupo ${grupo}: ${nome} → ${dezenas.join(', ')}`);
    }

    await transaction.commit();
    console.log("\nSeed concluído com sucesso!");
    console.log(`Total: ${animais.length} animais, ${animais.length * 4} dezenas registradas.`);
    process.exit(0);
    
  } catch (error) {
    await transaction.rollback();
    console.error("\n Erro ao rodar seed:", error);
    process.exit(1);
  }
}

seed();