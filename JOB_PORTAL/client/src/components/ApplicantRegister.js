import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ApplicantRegister = (props) => {
  const navigate = useNavigate();

  const [applicant, setApplicant] = useState({
    name: "",
    dob: "",
    email: "",
    mobile: "",
    password: "",
    cpassword: "",
  });

  const [photo, setPhoto] = useState(null);

  let name, value;
  const handleInputs = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;

    setApplicant({ ...applicant, [name]: value });
  };

  const handleInputsfiles = (e) => {
    console.log(e.target.files[0]);
    setPhoto(e.target.files[0]);
  };

  const SendData = async (e) => {
    e.preventDefault();
    const { name, dob, email, mobile, password, cpassword } = applicant;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("dob", dob);
    formData.append("email", email);
    formData.append("mobile", mobile);
    formData.append("password", password);
    formData.append("cpassword", cpassword);
    formData.append("photo", photo);

    const res = await fetch("/registerApplicant", {
      method: "POST",
      body: formData,
    });

    if (res.status === 201) {
      toast.success("Registration successfull");
      console.log("Registration successful");
      navigate("/login", { replace: true });
    } else {
      if (res.status === 422) {
        toast.warn("Please fill all field");
      } else {
        toast.error("Something went wrong");
      }
      console.log("Registration not successful");
    }
  };

  return (
    <>
      <div className="regform-container">
        <div className="regform">
          <div className="container">
            <div className="title">Applicant Registration</div>
            <div className="content">
              <form method="POST" encType="multipart/form-data">
                <div className="user-details">
                  <div className="input-box">
                    <span className="details">Name</span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      autoComplete="off"
                      value={applicant.name}
                      onChange={handleInputs}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span className="details">Email</span>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      autoComplete="off"
                      value={applicant.email}
                      onChange={handleInputs}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span className="details">Mobile No</span>
                    <input
                      type="text"
                      id="mob"
                      name="mobile"
                      placeholder="Enter your mobile number"
                      autoComplete="off"
                      value={applicant.mobile}
                      onChange={handleInputs}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span className="details">Password</span>
                    <input
                      type="password"
                      className="input-one-box"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      autoComplete="off"
                      value={applicant.password}
                      onChange={handleInputs}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span className="details">Confirm Password</span>
                    <input
                      type="password"
                      id="cpassword"
                      name="cpassword"
                      placeholder="Enter your password"
                      autoComplete="off"
                      value={applicant.cpassword}
                      onChange={handleInputs}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span className="details">Dob</span>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      placeholder="Enter your birthDate"
                      autoComplete="off"
                      value={applicant.dob}
                      onChange={handleInputs}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span className="details">Photo</span>
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      accept="image/*"
                      onChange={handleInputsfiles}
                      required
                    />
                  </div>
                </div>
                <div className="button">
                  <input type="submit" value="Register" onClick={SendData} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default ApplicantRegister;
