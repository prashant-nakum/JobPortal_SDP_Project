import { React, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import RenderMenu from "./RenderMenu";

const Navbar = () => {
  const [state, setState] = useState({ clicked: false });

  const handleClick = () => {
    setState({ clicked: !state.clicked });
  };
  return (
    <>
      <nav>
        <div className="logo">
          <h2>
            <span>J</span>ob
            <span>P</span>ortal
          </h2>
        </div>

        <div>
          <ul
            id="navbar"
            className={state.clicked ? "#navbar active" : "#navbar"}
          >
            <li>
              <NavLink exact to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/contact">
                Contact
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/profile">
                View Profile
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/applications">
                View Applications
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/viewjob">
                View Jobs
              </NavLink>
            </li>
            <RenderMenu />
          </ul>
        </div>

        <div id="mobile" onClick={handleClick}>
          <i
            id="bar"
            className={state.clicked ? "fas fa-times" : "fas fa-bars"}
          ></i>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;
