import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import BetsTable from "../components/tables/BetsTable";
import DrawsTable from "../components/tables/DrawsTable";

interface Bet {
  id: number;
  bet_type: string;
  bet_value: string;
  amount: number;
  potential_prize: number;
  status: string;
  created_at: string;
  animalName?: string;
}

interface Animal {
  group_number: number;
  animal_name: string;
  dezenas: string[];
}

type DrawRecord = {
  id: number;
  draw_datetime: string;
  status: string;
  results: { drawn_thousand: string }[];
  [key: string]: any; 
};

export default function History() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partialData, setPartialData] = useState({
    bets: [] as Bet[],
    draws: [] as DrawRecord[],
    animals: [] as Animal[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);

        const [betsRes, drawsRes, animalsRes] = await Promise.allSettled([
          api.get("/history"),
          api.get("/draws"),
          api.get("/animals"),
        ]);

        console.log("Resposta /history:", betsRes);
        console.log("Resposta /draws:", drawsRes);
        console.log("Resposta /animals:", animalsRes);

        // Processa cada resposta individualmente
        const bets = betsRes.status === "fulfilled" ? betsRes.value.data : [];
        const draws =
          drawsRes.status === "fulfilled" ? drawsRes.value.data : [];
        const animals =
          animalsRes.status === "fulfilled" ? animalsRes.value.data : [];

        setPartialData({ bets, draws, animals });

        // Loga apenas as falhas para debug
        if (drawsRes.status === "rejected") {
          console.error("Falha ao buscar sorteios:", drawsRes.reason);
          setError(
            "Não foi possível carregar os sorteios. Tente novamente mais tarde.",
          );
        }
      } catch (err: any) {
        // Erro crítico (ex: token expirado, rede offline)
        console.error("Erro crítico:", err);
        setError(
          err.response?.status === 401
            ? "Sessão expirada. Faça login novamente."
            : "Erro de conexão. Verifique sua internet.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const betsWithAnimal = useMemo(() => {
    return partialData.bets.map((bet) => {
      let animalName = "";

      if (bet.bet_type === "grupo") {
        const found = partialData.animals.find(
          (a) => a.group_number === Number(bet.bet_value),
        );
        animalName = found?.animal_name || "";
      }

      if (bet.bet_type === "dezena") {
        const found = partialData.animals.find((a) =>
          a.dezenas.includes(bet.bet_value),
        );
        animalName = found?.animal_name || "";
      }

      return { ...bet, animalName };
    });
  }, [partialData.bets, partialData.animals]); //Só recalcula se esses dados mudarem

  if (loading)
    return <p className="text-center py-6">Carregando histórico...</p>;

  if (error && !partialData.bets.length && !partialData.draws.length) {
    return (
      <div className="text-center py-6 text-red-600">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Histórico"
        description="Histórico de apostas e sorteios"
      />
      <PageBreadcrumb pageTitle="Histórico" />
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-sm text-yellow-700">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <ComponentCard title="Apostas Realizadas">
          {partialData.bets.length > 0 ? (
            <BetsTable bets={betsWithAnimal} />
          ) : (
            <p className="text-center text-gray-500 py-4">
              {error?.includes("histórico")
                ? "⚠️ Dados indisponíveis."
                : "Nenhuma aposta encontrada."}
            </p>
          )}
        </ComponentCard>

        <ComponentCard title="Sorteios Realizados">
          {partialData.draws.length > 0 ? (
            <DrawsTable
              draws={partialData.draws}
              animals={partialData.animals}
            />
          ) : (
            <p className="text-center text-gray-500 py-4">
              {error?.includes("sorteios")
                ? "⚠️ Sorteios indisponíveis."
                : "Nenhum sorteio encontrado."}
            </p>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
