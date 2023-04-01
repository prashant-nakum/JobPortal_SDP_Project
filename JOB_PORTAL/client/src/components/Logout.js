import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
const Logout = () => {
  const { dispatch } = useContext(UserContext);

  const Nevigate = useNavigate();

  const logoutUser = async () => {
    try {
      const res = await fetch("/logout", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      dispatch({ type: "USER", payload: 0 });
      if (res.status === 200) {
        Nevigate("/login", { replace: true });
      } else {
        const error = new Error(res.error);
        throw error;
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    logoutUser();
  }, []);

  return (
    <>
      <h1>Logout</h1>
    </>
  );
};

export default Logout;
