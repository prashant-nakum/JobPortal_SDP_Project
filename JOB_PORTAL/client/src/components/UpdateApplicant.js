import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const UpdateApplicant = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const [applicant, setApplicant] = useState({
    name: "",
    dob: "",
    email: "",
    mobile: "",
    password: "",
    cpassword: "",
  });

  let name, value;
  const handleInputs = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;

    setApplicant({ ...applicant, [name]: value });
  };

  useEffect(() => {
    // window.alert(params);
    getApplicantDetail();
  }, []);

  const getApplicantDetail = async () => {
    const result = await fetch(`/updateapplicant/${params.id}`);
    const data = await result.json();
    // console.log(data);
    setApplicant((prevApplicant) => ({
      ...prevApplicant,
      name: data.name,
      dob: formatDate(data.dob),
      email: data.email,
      mobile: data.mobile,
    }));
  };

  //for format date yyyy-mm-dd
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const updateApplicant = async (e) => {
    e.preventDefault();
    const { name, dob, email, mobile, password, cpassword } = applicant;

    const res = await fetch(`/updateapplicant/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, dob, email, mobile, password, cpassword }),
    });

    // const data = res.json();

    if (res.status === 200) {
      toast.success("Applicant updated successfully");
      // window.alert("update applicant successful");
      console.log("update applicant successful");
      navigate("/profile", { replace: true });
    } else {
      toast.error("Something went wrong");
      // window.alert("update applicant  not successful");
      console.log("update applicant  not successful");
    }
  };

  return (
    <>
      <div className="regform-container">
        <div className="regform">
          <div className="container">
            <div className="title">Update Profile</div>
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
                </div>
                <div className="button">
                  <input
                    type="submit"
                    value="Update"
                    onClick={updateApplicant}
                  />
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

export default UpdateApplicant;
