import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import BasicTableOne from "../components/tables/BasicTables/BasicTableOne";

import Button from "../components/ui/button/Button";

export default function Home() {
  return (
    <>
      <PageMeta title="Home" description="" />
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
        Painel Geral
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <ComponentCard title="Saldo Disponível">
          <div className="space-y-2">
            <p className="text-2xl font-bold mb-4 dark:text-white/90">
              R$ 1.000,00
            </p>
            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-600"
              size="sm"
            >
              Fazer aposta
            </Button>
          </div>
        </ComponentCard>

        <ComponentCard title="Simular Sorteio">
          <div className="space-y-2">
            <p className="mb-6 dark:text-white/90">
              Faça apostas para poder simular e ver os resultados.
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
              Simular Sorteio
            </Button>
          </div>
        </ComponentCard>
      </div>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <br />

        {/* Tabela de Apostas */}
        <div className="col-span-12 xl:col-span-12">
          <ComponentCard title="Suas Apostas">
            <BasicTableOne />
          </ComponentCard>
        </div>
      </div>
    </>
  );
}
