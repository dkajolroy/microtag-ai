"use client";
import { persistedStore, store } from "@/store";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<Preloader />} persistor={persistedStore}>
        {children}
      </PersistGate>
    </Provider>
  );
}

function Preloader() {
  return (
    <div
      style={{ minHeight: "100vh" }}
      className=" flex justify-center items-center transition-all "
    >
      <h2 className="text-center  text-3xl">Please wait...</h2>
    </div>
  );
}
