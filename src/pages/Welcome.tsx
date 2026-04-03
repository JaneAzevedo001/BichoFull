import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import BasicTableOne from "../components/tables/BetsTable";
import Button from "../components/ui/button/Button";
import { EyeIcon, EyeCloseIcon } from "../icons";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

//Interface da aposta
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

// busca e normaliza apostas do usuário
const fetchUserBets = async () => {
  const response = await api.get("/history");
  return response.data.map((bet: any) => ({
    ...bet,
    amount: Number(bet.amount) || 0,
    potential_prize: Number(bet.potential_prize) || 0,
  }));
};

const formatBRL = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return "Saldo não disponível";
  const num = Number(value) || 0;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(num);
};

export default function Welcome() {
  const { user, loading: authLoading } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [bets, setBets] = useState<Bet[]>([]);
  const [betsLoading, setBetsLoading] = useState(true);
  const navigate = useNavigate();

  // Função memoizada para carregar apostas
  const loadBets = useCallback(async () => {
    if (!user?.id) return;
    try {
      setBetsLoading(true);
      const data = await fetchUserBets();
      setBets(data);
    } catch (err) {
      console.error("Erro ao carregar apostas:", err);
    } finally {
      setBetsLoading(false);
    }
  }, [user?.id]);

  //Carrega apostas ao montar ou quando user mudar
  useEffect(() => {
    if (user?.id) {
      loadBets();
    }
  }, [user?.id, loadBets]);

  //Handler para simular sorteio
  const handleSimulateDraw = async () => {
    try {
      const response = await api.post("/draws/simulate");
      const winners = response.data.winners ?? 0;
      const totalPaid = response.data.totalPaid ?? 0;
      const message = response.data.message || "Sorteio realizado!";

      alert(
        `${message}\n🏆 ${winners} ganhador(es)\n💰 Total pago: R$ ${formatBRL(totalPaid).replace("R$ ", "")}`,
      );

      // Recarrega apostas e contexto do usuário para atualizar saldo
      await loadBets();
      // Se seu contexto tiver refresh, chame aqui: await refreshUser();
    } catch (err: any) {
      console.error("Erro ao simular sorteio:", err);
      alert(err.response?.data?.error || "Erro ao processar sorteio. Tente novamente.");
    }
  };

  //Estados de carregamento e erro
  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600 dark:text-gray-300">Carregando dados...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Nenhum usuário logado.</p>
        <Button className="mt-4" onClick={() => navigate("/login")}>
          Fazer login
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Painel" description="Bem-vindo ao seu painel de apostas" />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
        Painel Geral
      </h3>

      {/* Cards superiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Saldo Disponível */}
        <ComponentCard title="Saldo Disponível">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold dark:text-white/90">
                {showBalance ? formatBRL(user.balance) : "R$ •••••"}
              </p>
              <button
                type="button"
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={showBalance ? "Ocultar saldo" : "Mostrar saldo"}
                title={showBalance ? "Ocultar saldo" : "Mostrar saldo"}
              >
                {showBalance ? (
                  <EyeIcon className="w-5 h-5 fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyeCloseIcon className="w-5 h-5 fill-gray-500 dark:fill-gray-400" />
                )}
              </button>
            </div>
            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
              size="sm"
              onClick={() => navigate("/bet")}
            >
              Fazer aposta
            </Button>
          </div>
        </ComponentCard>

        {/* Simular Sorteio */}
        <ComponentCard title="Simular Sorteio">
          <div className="space-y-4">
            <p className="dark:text-white/90">
              Faça apostas para poder simular e ver os resultados.
            </p>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
              onClick={handleSimulateDraw}
              disabled={betsLoading}
            >
              {betsLoading ? "Processando..." : "Simular Sorteio"}
            </Button>
          </div>
        </ComponentCard>
      </div>

      {/* Tabela de Apostas */}
      <div className="mt-6">
        <ComponentCard title="Suas Apostas">
          {betsLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Carregando apostas...</p>
            </div>
          ) : bets.length > 0 ? (
            <BasicTableOne bets={bets} />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Você ainda não fez nenhuma aposta.</p>
              <Button size="sm" onClick={() => navigate("/bet")}>
                Fazer minha primeira aposta
              </Button>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}