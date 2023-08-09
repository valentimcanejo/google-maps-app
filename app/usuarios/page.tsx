"use client";

import { useState } from "react";

import ConvidarUsuario from "./_components/ModalConvidarUsuario";

import Header from "../_components/Header";

const Usuarios = () => {
  const [openModalConvidar, setOpenModalConvidar] = useState(false);
  return (
    <div className="dark:text-white">
      <Header titulo="Usuários" />
      <ConvidarUsuario
        open={openModalConvidar}
        titulo="Convidar Usuário"
        onClose={setOpenModalConvidar}
      />
      <div>
        <button
          onClick={() => setOpenModalConvidar(true)}
          className="bg-blue-400 hover:bg-blue-500 mb-2 py-2 px-4 rounded-lg text-white font-medium"
        >
          Convidar Usuário
        </button>
      </div>

      <div className="flex flex-col">
        <div className="overflow-x-auto ">
          <div className="inline-block min-w-full py-2">
            <div className="overflow-hidden border shadow-xl rounded-xl">
              <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b dark:border-neutral-500">
                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                      valentim.canejo@hotmail.com
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
