"use client";

import Image from "next/image";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { push } = useRouter();
  useEffect(() => {
    push("/clientes");
  }, []);

  return <main className=""></main>;
}
