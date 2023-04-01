import React, { createContext, useReducer } from "react";
import Routing from "./components/Routing";
import { initialState, reducer } from "./reducer/UseReducer";
import "./view/Design.css";

export const UserContext = createContext();

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log("state ", state);
  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
        <Routing />
      </UserContext.Provider>
    </>
  );
};

export default App;
