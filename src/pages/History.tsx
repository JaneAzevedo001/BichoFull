import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import BasicTableOne from "../components/tables/BasicTables/BasicTableOne";
import Button from "../components/ui/button/Button";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import axios from "axios";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface HistoryData {
  id: number;
  date: string;
  ganhos: number;
  perdas: number;
}

export default function History() {
  const [history, setHistory] = useState<HistoryData[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/history")
      .then((res) => setHistory(res.data))
      .catch((err) => console.error("Erro ao buscar histórico:", err));
  }, []);

  const data = {
    labels: history.map((item) => item.date),
    datasets: [
      {
        label: "Ganhos",
        data: history.map((item) => item.ganhos),
        borderColor: "rgb(34,197,94)",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.3,
      },
      {
        label: "Perdas",
        data: history.map((item) => item.perdas),
        borderColor: "rgb(239,68,68)",
        backgroundColor: "rgba(239,68,68,0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      tooltip: { enabled: true },
    },
  };

  return (
    <>
      <PageMeta title="Histórico" description="Ganhos e perdas" />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
        Histórico de Apostas
      </h3>

      <div className="gap-6">
        <ComponentCard title="Resumo">
          <div className="space-y-2">
            <p className="mb-4 dark:text-white/90">
              Veja abaixo o gráfico com seus ganhos e perdas.
            </p>
            <div className="w-full">
              <Line data={data} options={options} />
            </div>
          </div>
        </ComponentCard>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6 mt-6">
        <div className="col-span-12 xl:col-span-12">
          <ComponentCard title="Detalhes das Apostas">
            <BasicTableOne />
          </ComponentCard>
        </div>
      </div>

      <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
        <Button className="w-full" size="md">
          Fazer nova aposta
        </Button>
      </div>
    </>
  );
}
