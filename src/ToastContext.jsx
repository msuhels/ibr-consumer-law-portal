import React, { createContext, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  return (
    React.createElement(ToastContext.Provider, { value: toast },
      children,
      React.createElement(ToastContainer, { position: "top-right", autoClose: 10000, hideProgressBar: true })
    )
  );
}
