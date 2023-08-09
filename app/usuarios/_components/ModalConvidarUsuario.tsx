"use client";

import {
  ActionCodeSettings,
  getAuth,
  sendSignInLinkToEmail,
} from "firebase/auth";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { catchError } from "@/utils/firebaseErros";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  DocumentData,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import db, { firebaseAnalytics } from "@/firebase/initFirebase";

import { logEvent } from "firebase/analytics";

import { toast } from "react-hot-toast";
import { Button } from "@/app/_components/Button";
import PermissoesContext from "@/context/PermissoesContext";
import AppContext from "@/context/AppContext";

interface ModalProps {
  open: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  titulo?: string;
}

const getUserByEmail = async (email: string) => {
  //const collectionRef = getCollection(db, "projetos_usuarios");

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

function startFunction() {}

const ConvidarUsuario = ({
  open = false,
  onClose = startFunction,
  titulo,
}: ModalProps) => {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const { tema } = useContext(AppContext);

  const actionCodeSettings: ActionCodeSettings = {
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/cadastro`,

    handleCodeInApp: true,
  };

  const { idProjeto, userData } = useContext(PermissoesContext);

  const enviarEmail = async (e: any) => {
    e.preventDefault();

    try {
      const usuarioExiste = await getUserByEmail(email);

      if (!usuarioExiste) {
        const projetosUsuariosRef = collection(db, "projetos_usuarios");

        await sendSignInLinkToEmail(auth, email, actionCodeSettings);

        await addDoc(projetosUsuariosRef, {
          emailUsuario: email,
          aceito: false,
          idProjeto,
          criadoEm: new Date(),
          unidades: [],
        });

        toast.success("Convite enviado com sucesso.", {
          position: "bottom-center",
        });

        onClose(false);
        firebaseAnalytics &&
          logEvent(firebaseAnalytics, "convidar_usuario", {
            usuario: userData && userData[0].email_user,
          });

        setEmail("");
      } else {
        toast.error("Já existe um usuário com este email", {
          position: "bottom-center",
        });
      }
    } catch (error: any) {
      const erroTraduzido = catchError(error.code, error.message);
      console.log(error);
      toast.error(erroTraduzido, {
        position: "bottom-center",
      });
    }
  };

  return (
    <>
      <Transition appear show={open}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div
            className={`${tema} fixed inset-0 overflow-y-auto dark:text-white`}
          >
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={` w-96 max-w-md transform overflow-hidden rounded-2xl bg-neutral-300 dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all`}
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-base-content dark:text-white"
                  >
                    Digite o email
                  </Dialog.Title>
                  <form onSubmit={enviarEmail}>
                    <div className="mt-3">
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value.toLowerCase())}
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Email"
                        required
                      />
                    </div>

                    <div className="mt-4 flex justify-between">
                      <Button.Root
                        onClick={(e) => {
                          e.preventDefault(), onClose(false);
                        }}
                        type="button"
                        size="sm"
                        variant="standard"
                      >
                        <Button.Text>Cancelar</Button.Text>
                      </Button.Root>
                      <Button.Root type="submit" size="sm" variant="success">
                        <Button.Text>Enviar</Button.Text>
                      </Button.Root>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ConvidarUsuario;
