"use client";
import { useContext, useEffect, useRef, useState } from "react";

import {
  HomeIcon,
  LeftArrow,
  BacklogIcon,
  PedidosIcon,
  ProjetosIcon,
  SprintIcon,
  UsuarioIcon,
} from "@/utils/icons";

import SidebarItem from "../SidebarItem";
import Link from "next/link";
import useWindowSize from "@/hooks/useWindowSize";
import useAuth from "@/hooks/useAuth";
import AppContext from "@/context/AppContext";
import { usePathname } from "next/navigation";

interface ConteudoProps {
  children?: any;
}

export default function Sidebar({ children }: ConteudoProps) {
  const { isLogged, logado, logout, loggedUser } = useAuth();
  const { tema } = useContext(AppContext);
  const pathname = usePathname();

  const sidebarItems = [
    {
      texto: "Projetos",
      url: "/projetos",
      icone: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      ),
      onClick: () => {},
    },
    {
      texto: "Clientes",
      url: "/clientes",
      icone: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
          />
        </svg>
      ),
      onClick: () => {},
    },
    {
      texto: "Usuários",
      url: "/usuarios",
      icone: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      ),
      onClick: () => {},
    },
    {
      texto: "Sair",
      url: "/login",
      icone: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
          />
        </svg>
      ),
      onClick: logout,
    },
  ];

  const [open, setOpen] = useState<boolean>(
    typeof window !== "undefined" && localStorage.getItem("sidebar") === "true"
      ? true
      : false
  );
  const windowWidth = useWindowSize();

  const wrapperRef = useRef(null);

  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      function handleClickOutside(event: { target: any }) {
        if (windowWidth) {
          if (
            ref.current &&
            !ref.current.contains(event.target) &&
            windowWidth <= 640
          ) {
            setOpen(false);
          }
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, windowWidth]);
  }

  useOutsideAlerter(wrapperRef);

  const [update, setUpdate] = useState(true);

  const updateOpen = () => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("sidebar") === "true") {
        localStorage.setItem("sidebar", "false");
      } else {
        localStorage.setItem("sidebar", "true");
      }
      setUpdate(!update);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("sidebar") === "true") {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }
  }, [update]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (
        (windowWidth !== undefined && windowWidth <= 640) ||
        localStorage.getItem("sidebar") === "false"
      ) {
        setOpen(false);
      } else if (localStorage.getItem("sidebar") === "true") {
        setOpen(true);
      }
    }
  }, [windowWidth]);

  useEffect(() => {
    isLogged && isLogged();
  }, [logado]);

  return (
    <>
      {pathname === "/login" || pathname === "/cadastro" ? (
        <div>{children}</div>
      ) : logado ? (
        <div className={`${tema}  flex z-50 h-screen`}>
          {windowWidth && windowWidth <= 640 && !open ? null : (
            <div
              ref={wrapperRef}
              className={` ${
                open ? "w-64" : "w-20 "
              } bg-blue-600 dark:bg-gray-800 p-5 ${
                windowWidth && windowWidth <= 640 ? "fixed h-screen" : "sticky"
              }  z-50 top-0 pt-8 duration-300`}
            >
              <div
                className={`absolute cursor-pointer  w-7
           ${
             !open ? "rotate-180 right-7 top-[28rem] mt-8" : "right-2 bottom-20"
           }`}
                onClick={updateOpen}
              >
                {LeftArrow}
              </div>
              <Link href={{ pathname: "/main" }} className="no-underline">
                <div className="flex gap-x-4 ml-2 text-white items-center">
                  <div
                    className={`cursor-pointer duration-500 ${
                      open && "rotate-[360deg]"
                    }`}
                  >
                    {HomeIcon}
                  </div>

                  <h1
                    className={`text-white origin-left cursor-pointer font-medium text-xl duration-200 ${
                      !open && "scale-0"
                    }`}
                  >
                    Home
                  </h1>
                </div>
              </Link>
              <ul className="pt-4 pl-0">
                {sidebarItems?.map((sidebarItem) => (
                  <SidebarItem
                    key={sidebarItem.texto}
                    texto={sidebarItem.texto}
                    url={sidebarItem.url}
                    icone={sidebarItem.icone}
                    onClick={sidebarItem.onClick}
                    open={open}
                  />
                ))}
              </ul>
            </div>
          )}
          <div
            className={`bg-white dark:bg-gray-700 overflow-x-auto w-screen static py-2 lg:px-4 sm:px-0 px-0 shadow-md`}
          >
            {windowWidth && windowWidth <= 640 ? (
              <button
                onClick={() => setOpen(!open)}
                className="btn ml-4 mb-2 fixed z-40 btn-primary btn-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            ) : null}
            <div
              className={` ${
                windowWidth && windowWidth <= 640 ? "mt-8" : "mt-4"
              }`}
            >
              {children}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
