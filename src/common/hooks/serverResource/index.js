import React from "react";
import { ServerResourceContext } from "./context";

let initState;

export const useServerResource = () => {
  if (typeof window !== 'undefined') {
    if (_.isNil(initState)) initState = window.history.state;
    if (initState !== window.history.state) return;
  }
  return React.useContext(ServerResourceContext);
}