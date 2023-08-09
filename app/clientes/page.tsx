"use client";

import { useEffect, useState } from "react";
import Header from "../_components/Header";
import { useRouter } from "next/navigation";
import { collection, onSnapshot } from "firebase/firestore";
import db from "@/firebase/initFirebase";

const Clientes = () => {
  const [clientes, setClientes] = useState<any>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "clientes"), (snapshot) => {
      const clientesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setClientes(clientesData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main>
      <Header titulo="Clientes" />
      <div className="flex justify-end ">
        <button
          onClick={() => router.push("/adicionarCliente")}
          className="bg-green-400 hover:bg-green-500 py-2 px-4 text-white  mb-2 rounded-lg font-medium text-lg"
        >
          Adicionar Cliente
        </button>
      </div>
      <div className="overflow-x-auto mt-2 w-full rounded-xl dark:text-gray-300">
        <table className="w-full table-auto">
          <thead className="border font-medium dark:border-neutral-500">
            <tr>
              <th className="border px-6 py-4 text-lg ">Nome</th>
              <th className="border px-6 py-4 text-lg  ">Origem</th>
              <th className="border px-6 py-4 text-lg ">Destino</th>
              <th className="border px-6 py-4 text-lg w-1/12">Tempo</th>
              <th className="border px-6 py-4 text-lg w-1/12">Distância</th>
            </tr>
          </thead>
          <tbody>
            {clientes?.map((cliente: any) => (
              <tr key={cliente.id} className="border dark:border-neutral-500">
                <td className="border px-6 py-4 font-medium">
                  {cliente.email}
                </td>
                <td className="border px-6 py-4 font-medium overflow-hidden whitespace-nowrap">
                  {cliente.map ? cliente.map.origem : ""}
                </td>
                <td className="border px-6 py-4 font-medium">
                  {cliente.map ? cliente.map.destino : ""}
                </td>
                <td className="border px-6 py-4 font-medium w-1/12">
                  {cliente.map ? cliente.map.tempo : ""}
                </td>
                <td className="border px-6 py-4 font-medium w-1/12">
                  {cliente.map ? `${cliente.map.distancia} m` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Clientes;
