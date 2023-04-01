import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateApplication = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [application, setApplication] = useState({
    name: "",
    email: "",
    mobile: "",
    age: "",
    skills: "",
    qualification: "",
    experience: "",
    gender: "",
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;

    setApplication({ ...application, [name]: value });
  };

  useEffect(() => {
    getApplicationDetail();
  }, []);

  const getApplicationDetail = async () => {
    const res = await fetch(`/updateapplication/${params.id}`);
    const data = await res.json();
    setApplication((prevApplication) => ({
      ...prevApplication,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      age: data.age,
      skills: data.skills,
      qualification: data.qualification,
      experience: data.experience,
      gender: data.gender,
    }));
  };

  const updateApplication = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      mobile,
      age,
      skills,
      qualification,
      experience,
      gender,
    } = application;
    const res = await fetch(`/updateapplication/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        mobile,
        age,
        skills,
        qualification,
        experience,
        gender,
      }),
    });

    if (res.status === 200) {
      toast.success("Application updated successfully");
      // window.alert("Application updated successful");
      console.log("Application updated successful");
      navigate("/applications", { replace: true });
    } else {
      toast.error("Something went wrong");
      // window.alert("Application updated not successful");
      console.log("Application updated not successful");
    }
  };

  return (
    <>
      <div className="regform-container">
        <div className="regform">
          <div className="container">
            <div className="title">Application Form</div>
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
                      value={application.name}
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
                      value={application.email}
                      onChange={handleInputs}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span className="details">Mobile No.</span>
                    <input
                      type="text"
                      id="mob"
                      name="mobile"
                      placeholder="Enter your mobile number"
                      autoComplete="off"
                      value={application.mobile}
                      onChange={handleInputs}
                      required
                    />
                  </div>

                  <div className="input-box">
                    <span className="details">Age</span>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      placeholder="Enter your Age"
                      autoComplete="off"
                      value={application.age}
                      onChange={handleInputs}
                      required
                    />
                  </div>

                  <div className="input-box">
                    <span className="details">Skills</span>
                    <input
                      type="text"
                      id="skills"
                      name="skills"
                      placeholder="Enter your skills"
                      autoComplete="off"
                      value={application.skills}
                      onChange={handleInputs}
                      required
                    />
                  </div>

                  <div className="input-box">
                    <span className="details">Higher Qualification</span>
                    <select
                      className="department-detail"
                      id="qualification"
                      name="qualification"
                      value={application.qualification}
                      onChange={handleInputs}
                    >
                      <option>Not Selected</option>
                      <option>M.Tech</option>
                      <option>B. Tech</option>
                      <option>Diploma</option>
                      <option>12th</option>
                      <option>BCA</option>
                      <option>MCA</option>
                      <option>MBA</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="input-box">
                    <span className="details">Experience</span>
                    <select
                      className="department-detail"
                      name="experience"
                      id="experience"
                      value={application.experience}
                      onChange={handleInputs}
                    >
                      <option>Not Selected</option>
                      <option>Fresher</option>
                      <option>0-1 year</option>
                      <option>1-2 year</option>
                      <option>2-3 year</option>
                      <option>3-4 year</option>
                      <option>0-5 year</option>
                      <option>more then 5 year</option>
                    </select>
                  </div>
                </div>

                <div className="gender-details">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    id="dot-1"
                    checked={application.gender === "Male"}
                    onChange={handleInputs}
                  />
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    id="dot-2"
                    checked={application.gender === "Female"}
                    onChange={handleInputs}
                  />
                  <span className="gender-title">Gender</span>
                  <div className="category">
                    <label htmlFor="dot-1">
                      <span className="dot one"></span>
                      <span className="gender">Male</span>
                    </label>
                    <label htmlFor="dot-2">
                      <span className="dot two"></span>
                      <span className="gender">Female</span>
                    </label>
                  </div>
                </div>

                <div className="button">
                  <input
                    type="submit"
                    value="Update"
                    onClick={updateApplication}
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

export default UpdateApplication;
