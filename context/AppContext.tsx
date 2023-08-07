"use client";

import { createContext } from "react";

interface AppContextProps {
  tema?: string;
  alternarTema?: () => void;
}

const AppContext = createContext<AppContextProps>({});

export default AppContext;
