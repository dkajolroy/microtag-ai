"use client";
import { configureStore } from "@reduxjs/toolkit";
import { PersistConfig, persistReducer, persistStore } from "redux-persist";
import reducer from "./reducer";
import storage from "./storage";
// persist config
const config: PersistConfig<RootStore> = {
  key: "root",
  version: 1,
  whitelist: ["keywordInput"],
  storage,
  timeout: 1000,
  //   transforms: [
  //     encryptTransform({
  //       secretKey: "secret_key",
  //       onError: function (error) {
  //         location.reload();
  //       },
  //     }),
  //   ],
};

const persistedReducer = persistReducer(config, reducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    });
  },
});
export const persistedStore = persistStore(store);

export type RootStore = ReturnType<typeof reducer>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
