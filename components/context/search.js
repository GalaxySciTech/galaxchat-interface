import { createContext, useContext, useState } from "react";

const Context = createContext();

export function SearchProvider({ children }) {
  const [search, setSearch] = useState();
  return (
    <Context.Provider value={[search, setSearch]}>{children}</Context.Provider>
  );
}

export function useSearchContext() {
  return useContext(Context);
}
