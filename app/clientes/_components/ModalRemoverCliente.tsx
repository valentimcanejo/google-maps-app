"use client";

import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { Dialog, Transition } from "@headlessui/react";

import { Button } from "@/app/_components/Button";
import useAppData from "@/hooks/useAppData";

interface ModalProps {
  open: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  titulo?: string;
  onClick?: any;
}

function startFunction() {}

const ModalRemoverCliente = ({
  open = false,
  onClose = startFunction,
  titulo = "",
  onClick,
}: ModalProps) => {
  const { tema } = useAppData();

  const executarOnClick = async (e: any) => {
    e.preventDefault();
    await onClick();

    onClose(false);
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

          <div className="fixed inset-0 overflow-y-auto">
            <div
              className={`${tema} flex min-h-full items-center justify-center p-4 text-center`}
            >
              <Transition.Child
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={` w-full max-w-md transform  overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-700 p-6 text-left align-middle shadow-xl transition-all`}
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-base-content dark:text-white"
                  >
                    {titulo}
                  </Dialog.Title>
                  <form onSubmit={executarOnClick}>
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
                      <Button.Root type="submit" size="sm" variant="error">
                        <Button.Text>Remover</Button.Text>
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

export default ModalRemoverCliente;
