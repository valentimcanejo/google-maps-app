"use client";

import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { getAuth } from "firebase/auth";

import db from "@/firebase/initFirebase";
import { query, collection, where, onSnapshot } from "firebase/firestore";

import PermissoesContext from "./PermissoesContext";

const getProjectByID = (projeto: string, setData: (value: any) => void) => {
  const collectionRef = collection(db, "projetos");

  onSnapshot(collectionRef, (snapshot) => {
    const docs = snapshot.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id;

      return data;
    });
    const find = docs.find((pedido) => pedido.id.includes(projeto));

    setData(find);
  });
};

const getLoggedUser = (
  setData: any,
  usuarioLogado: string | undefined,
  idProjeto: string | undefined
) => {
  let collectionRef;

  if (usuarioLogado?.includes("token-login")) {
    collectionRef = query(
      collection(db, "projetos_usuarios"),
      where("emailUsuario", "==", usuarioLogado.split(":")[0])
    );
  } else {
    if (idProjeto === "") {
      collectionRef = query(
        collection(db, "projetos_usuarios"),
        where("idUsuario", "==", usuarioLogado)
      );
    } else {
      collectionRef = query(
        collection(db, "projetos_usuarios"),
        where("idUsuario", "==", usuarioLogado),
        where("idProjeto", "==", idProjeto)
      );
    }
  }

  onSnapshot(collectionRef, (snapshot) => {
    setData?.(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  });

  return;
};

const ProjectProvider = ({ children }: any) => {
  const { logado, loggedUser } = useAuth();
  const auth = getAuth();
  const user = auth.currentUser;
  const [userData, setUserData] = useState<any>([]);
  const [idProjeto, setIdProjeto] = useState<string>("");
  const [projeto, setProjeto] = useState<any>();
  const [projetoId, setProjetoId] = useState<string>();
  const [update, setUpdate] = useState<boolean>();

  const getProjeto = () => {
    try {
      if (projetoId) {
        getProjectByID(projetoId, setProjeto);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    //if (!logado) return;
    getProjeto();
  }, [projetoId, logado]);

  useEffect(() => {
    //if (!logado) return;
    if (projeto && projeto.id) {
      setIdProjeto(projeto.id);
    }
  }, [userData, logado, projeto]);

  useEffect(() => {
    //if (!logado) return;
    const projetoFromStorage = localStorage.getItem("@chame-rapido/idProjeto");

    setProjetoId(projetoFromStorage?.toString());
  }, [update, logado]);

  useEffect(() => {
    (async () => {
      try {
        if (loggedUser === "admin@gmail.com") {
          setUserData([{ email_user: "admin@gmail.com" }]);
        } else {
          if (projeto) {
            getLoggedUser(setUserData, user?.uid, projeto?.id);
          }
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [logado, projeto, user]);

  return (
    <PermissoesContext.Provider
      value={{ idProjeto, setUpdate, update, userData, setUserData }}
    >
      {children}
    </PermissoesContext.Provider>
  );
};

export default ProjectProvider;
