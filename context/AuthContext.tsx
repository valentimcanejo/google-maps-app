"use client";

import { createContext } from "react";

interface AuthContextProps {
  login?: (email: string, senha: string) => Promise<void>;
  logout?: () => Promise<void>;
  isLogged?: () => Promise<void>;
  logado?: boolean;
  cadastrarUsuario?: (
    nome: string,
    email: string,
    senha: string
  ) => Promise<void>;
  usuario?: any;
  setLogado?: any;
  loggedUser?: string;
}

const AuthContext = createContext<AuthContextProps>({});

export default AuthContext;
