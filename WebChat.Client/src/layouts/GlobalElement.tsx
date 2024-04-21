import { ReactNode, createContext, useState } from "react";

type GlobalElementContext = {
  showElement: (id: string, element: ReactNode) => void;
  hideElement: (id: string) => void;
  hideAllElement: () => void;
  store: {
    id: string;
    element: ReactNode;
  }[];
};

const initalState: GlobalElementContext = {
  showElement: () => {},
  hideElement: () => {},
  hideAllElement: () => {},
  store: [],
};

export const GlobalElementContext = createContext(initalState);

export default function GlobalElement({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<
    Array<{
      id: string;
      element: ReactNode;
    }>
  >([]);

  const showElement = (id: string, element: ReactNode) => {
    setStore([...store, { id, element }]);
  };

  const hideElement = (id: string) => {
    setStore(store.filter((s) => s.id !== id));
  };

  const hideAllElement = () => setStore([]);

  return (
    <GlobalElementContext.Provider value={{ store, showElement, hideElement, hideAllElement }}>
      {children}
      {store.map((item) => item.element)}
    </GlobalElementContext.Provider>
  );
}
