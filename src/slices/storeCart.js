import createWebStorage  from "redux-persist/lib/storage/createWebStorage";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

import {
   persistStore,
   persistReducer,
   FLUSH,
   REHYDRATE,
   PAUSE,
   PERSIST,
   PURGE,
   REGISTER,
} from "redux-persist";
import cartReducer from "./paginationReduser";

import localizationReducers from "./localizationReducer";

const rootReducer = combineReducers({
   localiztion: localizationReducers,
pageCount:cartReducer
});

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const persistConfig = {
  key: "commit",
  storage: storage,
  serialize: JSON.stringify,
  deserialize: JSON.parse,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
         },
      }),
});

const persistor = persistStore(store);


export { store, persistor };
