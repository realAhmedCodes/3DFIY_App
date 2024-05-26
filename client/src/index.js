import React from 'react';
import ReactDOM from 'react-dom/client';
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import './index.css';
import App from './App';
import  userDataSlice  from './slices/UserData';



const store = configureStore({
  reducer: {
    userData: userDataSlice
  },
});
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
