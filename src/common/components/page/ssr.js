import React from 'react';

export const PageSSRContext = React.createContext();

export const usePageSSR = (callback) => {
  const context = React.useContext(PageSSRContext);
  if (context) callback(context);
};
