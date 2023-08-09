"use client";

import { createContext } from "react";

interface PermissoesContextProps {
  idProjeto?: string;
  setUpdate?: any;
  update?: boolean;
  userData?: any;
  setUserData?: any;
}

const PermissoesContext = createContext<PermissoesContextProps>({});

export default PermissoesContext;
