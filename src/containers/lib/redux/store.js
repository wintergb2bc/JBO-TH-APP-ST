import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import {createWrapper, HYDRATE} from 'next-redux-wrapper'; //HYDRATE是 server rendering 才有用
import RootReducer from './reducers/RootReducer';
import HostConfig from '$LIB/Host.config';

// BINDING MIDDLEWARE
const bindMiddleware = (middleware) => {
  if (!HostConfig.Config.isLIVE) {
    const { composeWithDevTools } = require("redux-devtools-extension");
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const makeStore = ({ isServer }) => {
  if (isServer) {
    //If it's on server side, create a store
    return createStore(RootReducer, bindMiddleware([thunk]));
  } else {
    //If it's on client side, create a store which will persist
    const { persistStore, persistReducer } = require("redux-persist");
    const storage = require("redux-persist/lib/storage").default;

    const persistConfig = {
      key: "redux_persist_ec2021", //和主站分開
      storage, // if needed, use a safer storage
    };

    const persistedReducer = persistReducer(persistConfig, RootReducer); // Create a new reducer with our existing reducer

    const store = createStore(
      persistedReducer,
      bindMiddleware([thunk])
    ); // Creating the store again

    store.__persistor = persistStore(store); // This creates a persistor object & push that persisted object to .__persistor, so that we can avail the persistability feature

    return store;
  }
};

// export an assembled wrapper
export const storeWrapper = createWrapper(makeStore);