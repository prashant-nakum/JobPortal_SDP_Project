import { React, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApplicationForm = () => {
  const navigate = useNavigate();
  const location = useLocation(); //this is for getting data from previous page
  const company_email = location.state?.data;
  const job_id = location.state?.id;

  // console.log("job_id ", job_id);
  // console.log("company_email ", company_email);
  const [resume, setResume] = useState(null);
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

  const handleInputsfiles = (e) => {
    console.log(e.target.files[0]);
    setResume(e.target.files[0]);
  };

  const SendData = async (e) => {
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

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", mobile);
    formData.append("age", age);
    formData.append("skills", skills);
    formData.append("qualification", qualification);
    formData.append("experience", experience);
    formData.append("gender", gender);
    formData.append("resume", resume);
    formData.append("company_email", company_email);
    formData.append("job_id", job_id);
    const res = await fetch("/addApplication", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    console.log(data);
    if (res.status === 201) {
      toast.success("Application added successfully");
      // window.alert("Application added successfully");
      console.log("Application added successfully");
      navigate("/", { replace: true });
    } else {
      toast.error("Something went wrong");
      // window.alert("Application not added successfully");
      console.log("Application not added successfully");
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
                    <span className="details">Resume</span>
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      onChange={handleInputsfiles}
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
                    onChange={handleInputs}
                  />
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    id="dot-2"
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
                  <input type="submit" value="Apply" onClick={SendData} />
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

export default ApplicationForm;
