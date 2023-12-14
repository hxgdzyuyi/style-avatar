import { configureStore } from '@reduxjs/toolkit'
import allAccessoriesReducer from './reducers/allAccessoriesReducer';
import rootTreeReducer from './reducers/rootTreeReducer';
import panelModelReducer from './reducers/panelModelReducer';
import avatarModelReducer from './reducers/avatarModelReducer';
import { Provider } from "react-redux";

const store = configureStore({
  reducer: {
    allAccessories: allAccessoriesReducer,
    rootTree: rootTreeReducer,
    panelModel: panelModelReducer,
    avatarModel: avatarModelReducer,
  },
})

export default store;
