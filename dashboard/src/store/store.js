import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlices";
import messageReducer from "./slices/messageSlices";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

const rootReducer = combineReducers({
  user: userReducer,
  messages: messageReducer,
});
const persitConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persitConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
