"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import db, { auth, firebaseAnalytics } from "../firebase/initFirebase";

import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { catchError } from "@/utils/firebaseErros";

import AuthContext from "./AuthContext";

interface AuthProviderProps {
  children: React.ReactNode;
}

const getUserByEmail = async (email: string) => {
  const collectionRef = query(
    collection(db, "projetos_usuarios"),
    where("emailUsuario", "==", email)
  );

  const snapshots = await getDocs(collectionRef);

  const docs = snapshots.docs.map((doc) => {
    const data = doc.data();
    data.id = doc.id;

    return data;
  });

  return docs[0];
};

async function createToken(userFirebase: UserCredential): Promise<any> {
  const { user } = userFirebase;

  const token = await user.getIdToken();
  return {
    uid: user.uid,
    email: user.email,
    token: token,
  };
}

function gerenciarCookie(logado: string) {
  if (logado) {
    Cookies.set("digitaliza-auth", logado, {
      expires: 7, // 7 dias
    });
  } else {
    Cookies.remove("digitaliza-auth");
  }
}

const AuthProvider = (props: AuthProviderProps) => {
  const [usuario, setUsuario] = useState<any>();
  const [logado, setLogado] = useState<boolean>(false);
  const [loggedUser, setLoggedUser] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  async function configurarSessao(userFirebase: UserCredential) {
    if (userFirebase.user?.email) {
      const tokenUsuario = await createToken(userFirebase);
      setUsuario(tokenUsuario);
      gerenciarCookie(tokenUsuario.token);
      return usuario?.email;
    } else {
      gerenciarCookie("");
      return false;
    }
  }

  async function cadastrarUsuario(nome: string, email: string, senha: string) {
    try {
      const ref = await createUserWithEmailAndPassword(auth, email, senha);
      const emailS = await getUserByEmail(email);

      const finalRef = doc(db, "projetos_usuarios", emailS?.id);

      await updateDoc(finalRef, {
        nome,
        emailUsuario: ref.user.email,
        aceito: true,
        idUsuario: ref.user.uid,
      });

      await configurarSessao(ref);

      router.push("/clientes");
      return "sucesso";
    } catch (error: any) {
      const erroTraduzido = catchError(error.code, error.message);
      return erroTraduzido.toString();
    }
  }

  const login = async (email: string, senha: string) => {
    const userLogged = await signInWithEmailAndPassword(auth, email, senha);

    if (userLogged.user?.email) {
      await configurarSessao(userLogged);

      router.push("/clientes");
    }
  };

  const isLogged = async () => {
    try {
      auth.onIdTokenChanged((user) => {
        if (user?.email || user?.uid.includes("token-login")) {
          setLogado(true);
        } else {
          setLogado(false);
          if (pathname !== "/cadastro" && pathname !== "/login") {
            router.push("/login");
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    currentLoggedUser();
  }, [auth]);

  const currentLoggedUser = async () => {
    try {
      auth.onIdTokenChanged((user) => {
        if (user?.email) {
          setLoggedUser(user?.email);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        loggedUser,
        logout,
        login,
        isLogged,
        logado,
        cadastrarUsuario,
        usuario,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
