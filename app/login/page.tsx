"use client";

import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import AuthInput from "./_components/AuthInput";
import { IconeAtencao } from "@/utils/icons";
import { catchError } from "@/utils/firebaseErros";
import { Button } from "../_components/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/firebase/initFirebase";

const Login = () => {
  const searchParams = useSearchParams();
  const { login, logado } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [error, setError] = useState(null);
  const tokenString = searchParams.get("token") || "";
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (login) {
        await login(email, senha);
      }
    } catch (error: any) {
      const erroTraduzido = catchError(error.code, error.message);

      setError(erroTraduzido ? erroTraduzido : "Erro desconhecido");
      setTimeout(() => setError(null), 5000);
    }
  };

  const loginWithToken = async () => {
    try {
      if (tokenString) {
        const data = await signInWithCustomToken(auth, tokenString);

        if (data) {
          router.push("/projetos");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loginWithToken();
  }, [tokenString]);

  return (
    <div className="flex h-screen items-center justify-center">
      {/* <div className="hidden md:block md:w-1/2 lg:w-2/3 text-center">
        <img
          src="https://source.unsplash.com/random"
          alt="Imagem da Tela de Autenticação"
          className="h-screen w-full object-cover"
        />
      </div> */}
      <div className="m-20 w-full md:w-1/3 lg:w-1/4">
        {/* <div className="flex justify-center mb-6">
          <Image
            src="/images/dna-logo.png"
            alt="Picture of the author"
            width={170}
            height={90}
          />
        </div> */}
        <h1 className={`text-2xl mb-5`}>Entre com a sua conta</h1>

        {error ? (
          <div
            className={`flex items-center bg-red-400 text-white py-3 px-5 my-2 border border-red-700 rounded-lg`}
          >
            {IconeAtencao}
            <span className="ml-3">{error}</span>
          </div>
        ) : (
          false
        )}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-4 gap-4">
            <div className="flex">
              <AuthInput
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={setEmail}
              />
            </div>
            <div className="flex">
              <AuthInput
                label="Senha"
                id="password"
                type="password"
                value={senha}
                onChange={setSenha}
              />
            </div>
          </div>
          {/* <Link href={{ pathname: "/login/resetPassword" }}>
            <p className="mt-2 text-blue-500 underline cursor-pointer">
              Esqueceu sua senha?
            </p>
          </Link> */}
          <Button.Root type="submit" fullWidth size="lg">
            <Button.Text>Entrar</Button.Text>
          </Button.Root>
        </form>
      </div>
    </div>
  );
};

export default Login;
