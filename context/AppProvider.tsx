"use client";
import { createContext, useEffect, useState } from "react";
import AppContext from "./AppContext";

const AppProvider = ({ children }: any) => {
  const [tema, setTema] = useState("dark");

  function alternarTema() {
    console.log("entrou");

    const novoTema = tema === "" ? "dark" : "";
    setTema(novoTema);
    localStorage.setItem("tema", novoTema);
  }

  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema");
    setTema(temaSalvo!);
  }, []);

  return (
    <AppContext.Provider
      value={{
        tema,
        alternarTema,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
