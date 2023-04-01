import { React, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { UserContext } from "../App";

export const Login = () => {
  const { dispatch } = useContext(UserContext);

  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  let name, value;
  const handleInputs = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const LoginUser = async (e) => {
    e.preventDefault();

    const { email, password } = user;
    try {
      const res = await fetch("/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();
      console.log(data);
      console.log("data.role" + data.role);

      if (res.status === 200) {
        console.log(data.role);
        toast.success("Login successfull");
        // window.alert("Login successful");
        console.log("Login successful");

        if (data.role === 2) {
          //admin
          console.log("Admin Login successful");
          dispatch({ type: "USER", payload: 2 });
          navigate("/", { replace: true });
        } else if (data.role === 1) {
          //applicant
          console.log("Applicant Login successful");
          dispatch({ type: "USER", payload: 1 });
          navigate("/", { replace: true });
        } else if (data.role === 0) {
          //company
          dispatch({ type: "USER", payload: 3 });
          console.log(dispatch.payload);
          // window.alert("company login success");
          console.log("company");
          navigate("/", { replace: true });
        } else {
          toast.error("Login not successfull");
          // window.alert("Login not successful");
          console.log("Login not successful");
        }
      } else {
        toast.error("Invalid credentials");
        // window.alert("Login not successful");
        console.log("Login not successful");
      }
    } catch (err) {
      toast.error("Invalid credentials");
      console.log(err);
    }
  };

  return (
    <>
      <div className="regform-container">
        <div className="regform">
          <div className="container">
            <div className="title">Login</div>
            <div className="content">
              <form method="POST">
                <div className="user-details" id="login-user-details">
                  <div className="input-box">
                    <span className="details">Email</span>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={user.email}
                      onChange={handleInputs}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span className="details">Password</span>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      autoComplete="off"
                      value={user.password}
                      onChange={handleInputs}
                      required
                    />
                  </div>
                </div>
                <div className="button">
                  <input type="submit" value="Login" onClick={LoginUser} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" z-index="10000" />
    </>
  );
};
export default Login;
