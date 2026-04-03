import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Alert from "../ui/alert/Alert";
import api from "../../services/api"; 
import { AxiosError } from "axios";

// Interface para tipar o formulário
interface SignUpFormData {
  full_name: string;
  email: string;
  password: string;
}

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<SignUpFormData>({
    full_name: "",
    email: "",
    password: ""
  });

  const [success, setSuccess] = useState(false); // controla exibição do alerta
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      setSuccess(true); // ativa alerta de sucesso
      setErrorMsg(null);
      //redirecionar depois de alguns segundos:
      setTimeout(() => navigate("/signin"), 2000);
      // navigate("/signin");
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      setErrorMsg(error.response?.data?.error || "Erro ao registrar usuário");
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Voltar
        </Link>
      </div>

      <div className="w-full max-w-md pt-10 mx-auto">
        {/* Renderiza alerta de sucesso ou erro */}
        {success && (
          <Alert
            variant="success"
            title="Sucesso"
            message="Usuário registrado com sucesso."
          />
        )}
        {errorMsg && (
          <Alert
            variant="error"
            title="Erro"
            message={errorMsg}
            showLink={false}
          />
        )}
        </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Cadastrar
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Digite seu nome, e-mail e senha para se cadastrar!
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="sm:col-span-2">
                <Label>
                  Nome Completo<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="full_name"
                  placeholder="Insira seu nome completo"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                />
              </div>
              <div>
                <Label>
                  Email<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Insira seu e-mail"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <Label>
                  Senha<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Crie sua senha"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
              </div>
              <div>
                <Button
                  type="submit" className="w-full" size="sm"
                >
                  Inscreva-se
                </Button>
              </div>
            </div>
          </form>
          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Já tem uma conta?{" "}
              <Link
                to="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
