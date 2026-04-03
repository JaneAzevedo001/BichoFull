import { useState, useEffect } from "react";
import { useAuth } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import { EyeIcon, EyeCloseIcon } from "../icons";
import { Animal } from "../types/Bet";
import {
  formatBRL,
  formatBetValue,
  sanitizeDigits,
  isValidDecimal,
} from "../utils/formatters";

// Mapeamento de grupo - nome do arquivo SVG
const animalImages: Record<number, string> = {
  1: "avestruz.svg",
  2: "aguia.svg",
  3: "burro.svg",
  4: "borboleta.svg",
  5: "cachorro.svg",
  6: "cabra.svg",
  7: "carneiro.svg",
  8: "camelo.svg",
  9: "cobra.svg",
  10: "coelho.svg",
  11: "cavalo.svg",
  12: "elefante.svg",
  13: "galo.svg",
  14: "gato.svg",
  15: "jacare.svg",
  16: "leao.svg",
  17: "macaco.svg",
  18: "porco.svg",
  19: "pavao.svg",
  20: "peru.svg",
  21: "touro.svg",
  22: "tigre.svg",
  23: "urso.svg",
  24: "veado.svg",
  25: "vaca.svg",
};

export default function Bet() {
  const { user, loading, setUser } = useAuth();
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [loadingAnimais, setLoadingAnimais] = useState(true);
  const [showBalance, setShowBalance] = useState(true);

  // valores dos inputs
  const [grupoValue, setGrupoValue] = useState("");
  const [grupoAmount, setGrupoAmount] = useState("");
  const [dezenaValue, setDezenaValue] = useState("");
  const [dezenaAmount, setDezenaAmount] = useState("");
  const [milharValue, setMilharValue] = useState("");
  const [milharAmount, setMilharAmount] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/animals")
      .then((res) => {
        setAnimais(res.data);
        setLoadingAnimais(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar animais:", err);
        setLoadingAnimais(false);
      });
  }, []);

  const handleBet = async (
    bet_type: "grupo" | "dezena" | "milhar",
    bet_value: string,
    amount: string,
  ) => {
    if (!user) {
      alert("Usuário não autenticado.");
      return;
    }
    // Validação de dígitos
    if (
      bet_type === "grupo" &&
      (bet_value.length === 0 || bet_value.length > 2)
    ) {
      alert("O grupo deve ter até 2 dígitos (1–25).");
      return;
    }
    if (bet_type === "dezena" && bet_value.length !== 2) {
      alert("A dezena deve ter exatamente 2 dígitos (00–99).");
      return;
    }
    if (bet_type === "milhar" && bet_value.length !== 4) {
      alert("A milhar deve ter exatamente 4 dígitos (0000–9999).");
      return;
    }

    try {
      const normalizedValue = formatBetValue(
        bet_type,
        sanitizeDigits(bet_value),
      );
      const res = await api.post("/bets", {
        userId: user.id,
        bet_type,
        bet_value: normalizedValue,
        amount: parseFloat(amount),
      });

      alert(res.data.message);

      //Atualiza saldo sem perder os outros campos
      setUser({ ...user, balance: res.data.newBalance });
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro ao realizar aposta");
    }
  };

  const handleSimulateDraw = async () => {
    try {
      await api.post("/draws/simulate");
      alert("Sorteio processado! Redirecionando para o histórico...");
      navigate("/history"); // Redireciona para ver os resultados
    } catch (err: any) {
      console.error("Erro ao simular:", err);
      alert(err.response?.data?.error || "Erro ao processar sorteio.");
    }
  };

  if (loading || loadingAnimais) {
    return (
      <p className="text-gray-600 dark:text-gray-300">Carregando dados...</p>
    );
  }

  if (!user) {
    return <p className="text-red-500">Faça login para apostar.</p>;
  }

  return (
    <>
      <PageMeta title="Apostas" description="Página de apostas - BichoFull" />
      <PageBreadcrumb pageTitle="Apostar" />
      <h3 className="mb-6 dark:text-white/90">
        Escolha como apostar: grupo, dezena ou milhar!
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
        <ComponentCard title="Saldo Disponível">
          <div className="space-y-2">
            <p className="mb-6 font-bold dark:text-white/90">
              {showBalance ? formatBRL(user.balance) : "R$ •••••"}
              <button
                type="button"
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={showBalance ? "Ocultar saldo" : "Mostrar saldo"}
                title={showBalance ? "Ocultar saldo" : "Mostrar saldo"}
              >
                {showBalance ? (
                  <EyeIcon className="w-6 h-6 fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyeCloseIcon className="w-6 h-6 fill-gray-500 dark:fill-gray-400" />
                )}
              </button>
            </p>
          </div>
        </ComponentCard>

        <ComponentCard title="Simular Sorteio">
          <div className="space-y-2">
            <p className="mb-6 dark:text-white/90">
              Faça apostas para poder simular e ver os resultados.
            </p>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="sm"
              onClick={handleSimulateDraw}
            >
              Simular Sorteio
            </Button>
          </div>
        </ComponentCard>
      </div>
      <br />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        <ComponentCard title="Apostar no grupo">
          <div id="grupo-card" className="space-y-2">
            <p className="mb-6 dark:text-white/90">
              Escolha um grupo de animal (1-25).
            </p>
            <p className="mb-6 dark:text-white/90">
              Prêmio de 18x o valor apostado
            </p>
            <Input
              type="number"
              placeholder="Grupo"
              className="border rounded px-2 py-1 w-full"
              value={grupoValue}
              onChange={(e) => setGrupoValue(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Valor da aposta"
              className="border rounded px-2 py-1 w-full"
              value={grupoAmount}
              onChange={(e) => {
                const val = e.target.value;
                if (isValidDecimal(val)) setGrupoAmount(val);
              }}
            />
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600"
              size="sm"
              onClick={() => handleBet("grupo", grupoValue, grupoAmount)}
            >
              Confirmar Aposta
            </Button>
          </div>
        </ComponentCard>
        <ComponentCard title="Apostar na Dezena">
          <div className="space-y-2">
            <p className="mb-6 dark:text-white/90">
              Escolha uma dezena (00-99).
            </p>
            <p className="mb-6 dark:text-white/90">
              Prêmio de 60x o valor apostado
            </p>
            <Input
              type="number"
              placeholder="Dezena"
              className="border rounded px-2 py-1 w-full"
              value={dezenaValue}
              onChange={(e) => setDezenaValue(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Valor da aposta"
              className="border rounded px-2 py-1 w-full"
              value={dezenaAmount}
              onChange={(e) => {
                const val = e.target.value;
                if (isValidDecimal(val)) setDezenaAmount(val);
              }}
            />
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              size="sm"
              onClick={() => handleBet("dezena", dezenaValue, dezenaAmount)}
            >
              Confirmar Aposta
            </Button>
          </div>
        </ComponentCard>
        <ComponentCard title="Apostar na Milhar">
          <div className="space-y-2">
            <p className="mb-6 dark:text-white/90">
              Escolha uma milhar (0000-9999).
            </p>
            <p className="mb-6 dark:text-white/90">
              Prêmio de 4000x o valor apostado.
            </p>
            <Input
              type="number"
              placeholder="Milhar"
              className="border rounded px-2 py-1 w-full"
              value={milharValue}
              onChange={(e) => setMilharValue(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Valor da aposta"
              className="border rounded px-2 py-1 w-full"
              value={milharAmount}
              onChange={(e) => {
                const val = e.target.value;
                if (isValidDecimal(val)) setMilharAmount(val);
              }}
            />
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="sm"
              onClick={() => handleBet("milhar", milharValue, milharAmount)}
            >
              Confirmar Aposta
            </Button>
          </div>
        </ComponentCard>
      </div>
      <br />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {animais.map((animal) => (
          <ComponentCard
            key={animal.id}
            title={`${animal.animal_name}`}
            className="flex flex-col items-center mb-2"
          >
            <div className="flex flex-col items-center mb-2">
              <p className="text-gray-700 dark:text-white/90 mb-2 text-center">
                {animal.group_number}
              </p>
              <img
                src={`/images/animals/${animalImages[animal.group_number]}`}
                alt={animal.animal_name}
                className="w-14 h-14 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>

            {animal.dezenas && animal.dezenas.length > 0 && (
              <div className="w-full mb-3">
                <div className="flex flex-wrap justify-center gap-1">
                  {animal.dezenas.map((dezena) => (
                    <span
                      key={dezena}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded font-mono"
                    >
                      {dezena}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Button
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => {
                  setGrupoValue(String(animal.group_number)); // preenche o número do grupo
                  setGrupoAmount("1"); //valor padrão da aposta
                  document
                    .getElementById("grupo-card")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Apostar no Grupo
              </Button>
            </div>
          </ComponentCard>
        ))}
      </div>
      <br />
    </>
  );
}
