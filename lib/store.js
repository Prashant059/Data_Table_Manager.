import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from './persistStorage'
import tableReducer from './features/table/tableSlice'
import themeReducer from './features/theme/themeSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['table', 'theme'],
}

const rootReducer = combineReducers({
  table: tableReducer,
  theme: themeReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)
