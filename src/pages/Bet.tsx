import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
  

const animais = [
  { nome: "Avestruz", grupo: "01-02-03-04", img: "../public/images/animals/avestruz.svg"},
  { nome: "Águia", grupo: "05-06-07-08",  img: "../public/images/animals/aguia.svg"},
  { nome: "Burro", grupo: "09-10-11-12", img: "../public/images/animals/burro.svg" },
  { nome: "Borboleta", grupo: "13-14-15-16", img: "../public/images/animals/borboleta.svg" },
  { nome: "Cachorro", grupo: "17-18-19-20", img: "../public/images/animals/cachorro.svg"},
  { nome: "Cabra", grupo: "21-22-23-24", img: "../public/images/animals/cabra.svg"},
  { nome: "Carneiro", grupo: "25-26-27-28", img: "../public/images/animals/carneiro.svg"},
  { nome: "Camelo", grupo: "29-30-31-32", img: "../public/images/animals/camelo.svg"},
  { nome: "Cobra", grupo: "33-34-35-36", img: "../public/images/animals/cobra.svg"},
  { nome: "Coelho", grupo: "37-38-39-40", img: "../public/images/animals/coelho.svg"},
  { nome: "Cavalo", grupo: "41-42-43-44", img: "../public/images/animals/cavalo.svg"},
  { nome: "Elefante", grupo: "45-46-47-48", img: "../public/images/animals/elefante.svg"},
  { nome: "Galo", grupo: "49-50-51-52", img: "../public/images/animals/galo.svg"},
  { nome: "Gato", grupo: "53-54-55-56", img: "../public/images/animals/gato.svg"},
  { nome: "Jacaré", grupo: "57-58-59-60", img: "../public/images/animals/jacare.svg"},
  { nome: "Leão", grupo: "61-62-63-64", img: "../public/images/animals/leao.svg"},
  { nome: "Macaco", grupo: "65-66-67-68", img: "../public/images/animals/macaco.svg"},
  { nome: "Porco", grupo: "69-70-71-72", img: "../public/images/animals/porco.svg"},
  { nome: "Pavão", grupo: "73-74-75-76", img: "../public/images/animals/pavao.svg"},
  { nome: "Peru", grupo: "77-78-79-80", img: "../public/images/animals/peru.svg"},
  { nome: "Touro", grupo: "81-82-83-84", img: "../public/images/animals/touro.svg"},
  { nome: "Tigre", grupo: "85-86-87-88", img: "../public/images/animals/tigre.svg"},
  { nome: "Urso", grupo: "89-90-91-92", img: "../public/images/animals/urso.svg"},
  { nome: "Veado", grupo: "93-94-95-96", img: "../public/images/animals/veado.svg"},
  { nome: "Vaca", grupo: "97-98-99-00", img: "../public/images/animals/vaca.svg"}
];

export default function Bet() {
  return (
    <>
      <PageMeta title="Apostas" description="Página de apostas - BichoFull" />
      <PageBreadcrumb pageTitle="Apostas" />
      <h3 className="mb-6 dark:text-white/90">Escolha como apostar: grupo, dezena ou milhar!</h3>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
        <ComponentCard title="Saldo Disponível">
            <div className="space-y-2">
                <p className="text-2xl font-bold mb-4 dark:text-white/90">R$ 1.000,00</p>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600" size="sm">
                     Fazer aposta
                </Button>
            </div>
          </ComponentCard>
      <ComponentCard title="Simular Sorteio">            
            <div className="space-y-2">
                <p className="mb-6 dark:text-white/90">Faça apostas para poder simular  e ver os resultados.</p>               
              <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                    Simular Sorteio
                </Button>
            </div>
          </ComponentCard>
          
          </div>
        <br />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
         <ComponentCard title="Apostar no grupo">     
            <div className="space-y-2">
                <p className="mb-6 dark:text-white/90">Escolha um grupo de animal (1-25).</p>
                <p className="mb-6 dark:text-white/90">Prêmio de 18x o valor apostado</p>
                <Input
                type="number"
                placeholder="Valor da aposta"
                className="border rounded px-2 py-1 w-full"
              />
              <Button className="w-full bg-orange-500 hover:bg-orange-600" size="sm">
                    Confirmar Aposta
                </Button>
            </div>
          </ComponentCard>
        <ComponentCard title="Apostar na Dezena">            
            <div className="space-y-2">
                <p className="mb-6 dark:text-white/90">Escolha uma dezena (00-99).</p>
                <p className="mb-6 dark:text-white/90">Prêmio de 60x o valor apostado</p>
                <Input
                type="number"
                placeholder="Valor da aposta"
                className="border rounded px-2 py-1 w-full"
              />
              <Button className="w-full bg-green-600 hover:bg-green-700" size="sm">
                    Confirmar Aposta
                </Button>
            </div>
          </ComponentCard>
          <ComponentCard title="Apostar na Milhar">            
            <div className="space-y-2">
                <p className="mb-6 dark:text-white/90">Escolha uma milhar (0000-9999).</p>
                <p className="mb-6 dark:text-white/90">Prêmio de 4000x  o valor apostado.</p>
                <Input
                type="number"
                placeholder="Valor da aposta"
                className="border rounded px-2 py-1 w-full"
              />
              <Button className="w-full bg-purple-600 hover:bg-purple-700" size="sm">
                    Confirmar Aposta
                </Button>
            </div>
          </ComponentCard>
      </div>
        <br />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {animais.map((animal, index) => (
  <ComponentCard key={index} title={animal.nome} className="flex flex-col items-center mb-2">
    <div className="flex flex-col items-center mb-2">
      {animal.img && (
        <img 
          src={animal.img} 
          alt={animal.nome} 
          className="w-20 h-20 object-contain"
        />
      )}
      <p className="text-gray-700 dark:text-white/90 mb-2 text-center">
        {animal.grupo}
      </p>      
    </div>
    <div className="space-y-2">
      <Button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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
