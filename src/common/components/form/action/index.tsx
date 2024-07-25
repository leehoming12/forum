import React from 'react';

type FormEventListener = {
  addEventListener: (action: string, callback: () => void) => void;
  removeEventListener: (action: string, callback: () => void) => void;
};

export const FormEventListenerContext = React.createContext<FormEventListener>({
  addEventListener: () => { },
  removeEventListener: () => { },
});

export const useFormEventListener = () => React.useContext(FormEventListenerContext);
