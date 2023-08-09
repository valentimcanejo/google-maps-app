"use client";

import { getAuth, isSignInWithEmailLink } from "firebase/auth";

import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { Input } from "../_components/Input";
import { Button } from "../_components/Button";
import { Toaster, toast } from "react-hot-toast";

const Cadastro = () => {
  const auth = getAuth();

  const { cadastrarUsuario } = useAuth();
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const signInUsingEmailLink = async (e: any) => {
    e.preventDefault();

    if (isSignInWithEmailLink(auth, window.location.href)) {
      if (cadastrarUsuario) {
        const nomeCompleto = nome + " " + sobrenome;
        const message: any = await cadastrarUsuario(nomeCompleto, email, senha);
        console.log(message);
        if (message === "sucesso") {
          toast.success("Usuário cadastrado com sucesso.", {
            position: "bottom-center",
          });
        } else {
          toast.error(message?.toString(), {
            position: "bottom-center",
          });
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <Toaster />
      <div className="md:w-1/4 w-full shadow-xl p-12">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
          Se cadastre com seu email
        </h1>
        <form className="flex flex-col gap-6" onSubmit={signInUsingEmailLink}>
          <Input
            label="Nome"
            type="name"
            value={nome}
            onChange={setNome}
            name="name"
            id="nome"
            placeholder="Nome"
            required
          />
          <Input
            label="Sobrenome"
            type="name"
            value={sobrenome}
            onChange={setSobrenome}
            name="name"
            id="name"
            placeholder="Sobrenome"
            required
          />

          <Input
            type="email"
            label="Email"
            value={email}
            onChange={setEmail}
            name="email"
            id="email"
            placeholder="Email"
            required
          />

          <Input
            type="password"
            label="Senha"
            value={senha}
            onChange={setSenha}
            name="senha"
            id="senha"
            placeholder="••••••••"
            required
          />

          <Button.Root type="submit" fullWidth size="lg">
            <Button.Text>Cadastrar</Button.Text>
          </Button.Root>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
