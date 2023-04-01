import React, { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AiFillCaretDown } from "react-icons/ai";
import { UserContext } from "../App";

const RenderMenu = () => {
  const { state } = useContext(UserContext);
  const [reg, setReg] = useState(false);
  const [dropbtn, setDropbtn] = useState(false);
  const [role, Setrole] = useState(3);
  const handleRegister = () => {
    setReg(!reg);
    setDropbtn(!dropbtn);
  };

  const callProfilePage = async () => {
    try {
      const res = await fetch("/profile", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      if (res.status !== 200) {
        Setrole(3);
      } else {
        Setrole(data.role);
      }
    } catch (err) {
      Setrole(3);
      console.log(err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      callProfilePage();
    }, 1000); // 1 seconds

    return () => clearInterval(interval);
  }, []);

  console.log("state of user ", state);
  console.log("role of user ", role);
  if (role === 0) {
    //company
    return (
      <>
        <li>
          <NavLink exact to="/addJob">
            Add Job
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/acceptApplication">
            Accepted Application
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/logout">
            Log Out
          </NavLink>
        </li>
      </>
    );
  } else if (role === 1) {
    //applicant
    return (
      <>
        <li>
          <NavLink exact to="/viewcompany">
            View Company
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/logout">
            Log Out
          </NavLink>
        </li>
      </>
    );
  } else if (role === 2) {
    //admin
    return (
      <>
        <li>
          <NavLink exact to="/viewapplicants">
            View Applicant
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/viewcompany">
            View Company
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/viewcontact">
            Messages
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/logout">
            Log Out
          </NavLink>
        </li>
      </>
    );
  } else {
    //logout
    return (
      <>
        <li>
          <NavLink exact to="/login">
            Login
          </NavLink>
        </li>
        <li>
          <div className="dropdown">
            <div className="dropbtn" onClick={handleRegister}>
              Register
              <AiFillCaretDown />
            </div>

            <div id="regdrop" className={reg ? "dropdown-content" : "hidedrop"}>
              <NavLink
                id="comreg"
                exact
                to="/companyRegister"
                onClick={handleRegister}
              >
                Company
              </NavLink>
              <NavLink
                id="comreg"
                exact
                to="/applicantRegister"
                onClick={handleRegister}
              >
                Applicant
              </NavLink>
            </div>
          </div>
        </li>
      </>
    );
  }
};

export default RenderMenu;
