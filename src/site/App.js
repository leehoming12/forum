import React from 'react';

export const App = () => {

  React.useEffect(() => {
    window.location = '/cms';
  }, []);

  return (
    <div />
  );
};

export default App;
