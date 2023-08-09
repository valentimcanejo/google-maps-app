"use client";

import BotaoAlternarTema from "@/app/_components/BotaoAlterarTema";
import useAppData from "@/hooks/useAppData";
import Titulo from "../Titulo";
import AvatarUsuario from "../AvatarUsuario";

interface HeaderProps {
  titulo: string;
}

export default function Header(props: HeaderProps) {
  const { tema, alternarTema } = useAppData();

  return (
    <div className={`flex mb-4`}>
      <Titulo titulo={props.titulo} />
      <div className={`flex flex-grow justify-end items-center`}>
        <BotaoAlternarTema tema={tema} alternarTema={alternarTema} />
        <AvatarUsuario className="ml-3" />
      </div>
    </div>
  );
}
