// backend/src/routes/animalsRouter.js
import express from "express";
import Animal from "../models/Animal.js";
import GroupNumber from "../models/GroupNumber.js";

const router = express.Router();

const gerarDezenas = (grupo) => {
  if (grupo < 1 || grupo > 25) return [];
  const inicio = (grupo - 1) * 4 + 1;
  return Array.from({ length: 4 }, (_, i) => {
    const num = inicio + i;
    return num === 100 ? "00" : String(num).padStart(2, '0');
  });
};

//Normaliza nome do animal para arquivo SVG (remove acentos e espaços)
const normalizarNome = (nome) => {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
};


const ordenarDezenas = (dezenas) => {
  return [...dezenas].sort((a, b) => {
    const valA = a === "00" ? 100 : parseInt(a, 10);
    const valB = b === "00" ? 100 : parseInt(b, 10);
    return valA - valB;
  });
};

// GET /api/animals
router.get("/", async (req, res) => {
  try {
    // Busca animais com suas dezenas associadas
    const animals = await Animal.findAll({
      include: [{
        model: GroupNumber,
        as: 'dezenas',
        attributes: ['number']
      }],
      order: [['group_number', 'ASC']]
    });

    // Formata resposta para o frontend
    const formatted = animals.map(animal => {
      const dezenasRaw = animal.dezenas?.map(d => d.number) || [];
      const dezenasOrdenadas = ordenarDezenas(dezenasRaw);

      return {
        id: animal.id,
        animal_name: animal.animal_name,
        group_number: animal.group_number,
        dezenas: dezenasOrdenadas, 
        img: `${normalizarNome(animal.animal_name)}.svg`
      };
    });

    res.json(formatted);
    
  } catch (error) {
    console.error("Erro ao buscar animais:", error);
    res.status(500).json({ 
      error: "Erro ao buscar animais",
      message: error.message 
    });
  }
});

export default router;