import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/button/Button";
import { ThemeToggleButton } from "../../components/common/ThemeToggleButton";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-6">
      <img
        src="/images/logo/logo.svg"
        alt="logo"
        className="w-40 sm:w-32 md:w-48 h-auto mb-8"
      />

      <div className="max-w-2xl text-center">
        <h1 className="mb-6 text-4xl font-bold text-black dark:text-white">
          Bem-vindo ao BichoFull
        </h1>

        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          Aprenda a mecânica do Jogo do Bicho em um ambiente seguro e gratuito.
        </p>

        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          Entre e simule suas apostas no Jogo do Bicho com saldo fictício.
          Divirta-se sem riscos e aprenda como funciona a mecânica!
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-6 mb-6">
          <Button className="" size="md" onClick={() => navigate("/signin")}>
            Entrar
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600"
            size="md"
            onClick={() => navigate("/bet")}
          >
            Fazer Aposta
          </Button>
        </div>
      </div>
      <br />
      <div className="max-w-2xl text-center">
        <h3 className="mb-6 justify-center text-3xl font-bold text-black dark:text-white">
          Por que jogar aqui?
        </h3>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          <strong>Risco Zero:</strong> Saldo fictício para fins de estudo e
          diversão.
        </p>
        <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
          Ao se cadastrar, você recebe <strong>R$ 1.000,00 em saldo fictício</strong>{" "}
          para começar a simular suas apostas em Grupos, Dezenas ou Milhares.
        </p>
        <h3 className="mb-2 justify-center text-3xl font-bold text-black dark:text-white">
          Plataforma 100% gratuita!
        </h3>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-6 mb-8">
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          size="md"
          onClick={() => navigate("/bet")}
        >
          Começar Agora
        </Button>
      </div>

      <div className="p-4">
        <div
          className="bg-purple-100 rounded-lg py-5 px-6 mb-4 text-base text-purple-700 mb-3"
          role="alert"
        >
          {" "}
          O BichoFull não aceita dinheiro real nem realiza pagamentos.
        </div>
        <div
          className="bg-purple-100 rounded-lg py-5 px-6 mb-4 text-base text-purple-700 mb-8"
          role="alert"
        >
          {" "}
          Ferramenta educacional para simular probabilidades e
          gerenciamento de banca virtual.
        </div>
      </div>
      <div>
        <br />
        <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
          &copy; {new Date().getFullYear()} - BichoFull
        </p>
      </div>
      {/* <ThemeToggleButton/> */}
      <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
        <ThemeToggleButton />
      </div>
    </div>
  );
}
