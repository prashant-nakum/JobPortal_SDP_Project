import { React, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateJob = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [job, setJob] = useState({
    vacancies: "",
    city: "",
    state: "",
    skills: "",
    ageLimit: "",
    experience: "",
    salary: "",
    qualification: "",
    openDate: "",
    closeDate: "",
    jobType: "",
    fieldTypes: "",
    gender: "",
  });

  let name, value;
  const handleInputs = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;
    console.log(name);
    console.log(value);
    setJob({ ...job, [name]: value });
  };

  useEffect(() => {
    getJobDetail();
  }, []);

  const getJobDetail = async () => {
    const res = await fetch(`/updatejob/${params.id}`);
    const data = await res.json();
    setJob((prevJob) => ({
      ...prevJob,
      vacancies: data.vacancies,
      city: data.city,
      state: data.state,
      skills: data.skills,
      ageLimit: data.ageLimit,
      experience: data.experience,
      salary: data.salary,
      qualification: data.qualification,
      openDate: formatDate(data.openDate),
      closeDate: formatDate(data.closeDate),
      jobType: data.jobType,
      fieldTypes: data.fieldTypes,
      gender: data.gender,
    }));
    console.log("job", job);
  };

  //for format date yyyy-mm-dd
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const updateJob = async (e) => {
    e.preventDefault();

    const {
      vacancies,
      city,
      state,
      skills,
      ageLimit,
      experience,
      salary,
      qualification,
      openDate,
      closeDate,
      jobType,
      fieldTypes,
      gender,
    } = job;
    const res = await fetch(`/updatejob/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vacancies,
        city,
        state,
        skills,
        ageLimit,
        experience,
        salary,
        qualification,
        openDate,
        closeDate,
        jobType,
        fieldTypes,
        gender,
      }),
    });

    if (res.status === 200) {
      toast.success("Job updated successfully");
      // window.alert("Job updated successful");
      console.log("Job updated successful");
      navigate("/viewjob", { replace: true });
    } else {
      toast.error("Something went wrong");
      // window.alert("Job updated not successful");
      console.log("Job updated not successful");
    }
  };

  return (
    <>
      <div className="regform-container">
        <div className="regform" id="addjob-big">
          <div className="container" id="addjob">
            <div className="title">Update Job</div>
            <div className="content">
              <form method="POST">
                <div className="user-details">
                  <div className="input-box">
                    <span className="details">Vacancies</span>
                    <input
                      type="number"
                      id="vacancies"
                      name="vacancies"
                      placeholder="Enter No. of vacancies"
                      autoComplete="off"
                      value={job.vacancies}
                      onChange={handleInputs}
                      required
                    />
                  </div>

                  <div className="input-box">
                    <span className="details">City</span>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      placeholder="Enter city name"
                      autoComplete="off"
                      value={job.city}
                      onChange={handleInputs}
                      required
                    />
                  </div>

                  <div className="input-box">
                    <span className="details">State</span>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      placeholder="Enter state name"
                      autoComplete="off"
                      value={job.state}
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
                      placeholder="Enter skills"
                      autoComplete="off"
                      value={job.skills}
                      onChange={handleInputs}
                      required
                    />
                  </div>

                  <div className="input-box">
                    <span className="details">Age Limit</span>
                    <input
                      type="text"
                      id="ageLimit"
                      name="ageLimit"
                      placeholder="Enter age limit"
                      autoComplete="off"
                      value={job.ageLimit}
                      onChange={handleInputs}
                      required
                    />
                  </div>

                  <div className="input-box">
                    <span className="details">Experience</span>
                    <select
                      className="department-detail"
                      name="experience"
                      id="experience"
                      value={job.experience}
                      onChange={handleInputs}
                    >
                      <option>Not Selected</option>
                      <option>Fresher</option>
                      <option>0-1 year</option>
                      <option>1-2 year</option>
                      <option>2-3 year</option>
                      <option>3-4 year</option>
                      <option>0-5 year</option>
                      <option value="more then 5 year">more then 5 year</option>
                    </select>
                  </div>

                  <div className="input-box">
                    <span className="details">Salary</span>
                    <select
                      className="department-detail"
                      name="salary"
                      id="salary"
                      value={job.salary}
                      onChange={handleInputs}
                    >
                      <option>Not Selected</option>
                      <option>upto 10,000 ₹</option>
                      <option>upto 40,000 ₹</option>
                      <option>upto 70,000 ₹</option>
                      <option>upto 1,00000 ₹</option>
                      <option>more then 1,00000 ₹</option>
                    </select>
                  </div>

                  <div className="input-box">
                    <span className="details">Higher Qualification</span>
                    <select
                      className="department-detail"
                      name="qualification"
                      id="qualification"
                      value={job.qualification}
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
                      <option>Anything</option>
                    </select>
                  </div>

                  <div className="input-box">
                    <span className="details">Field Type</span>
                    <select
                      className="department-detail"
                      name="fieldTypes"
                      id="fieldTypes"
                      value={job.fieldTypes}
                      onChange={handleInputs}
                    >
                      <option>Not Selected</option>
                      <option>IT</option>
                      <option>Computer</option>
                      <option>Mechenical</option>
                      <option>Electrical</option>
                      <option>Civil</option>
                      <option>Chemical</option>
                      <option>Agriculture</option>
                    </select>
                  </div>

                  <div className="input-box">
                    <span className="details">Application Open</span>
                    <input
                      type="date"
                      id="openDate"
                      name="openDate"
                      placeholder="Enter application open date"
                      autoComplete="off"
                      value={job.openDate}
                      onChange={handleInputs}
                      required
                    />
                  </div>

                  <div className="input-box">
                    <span className="details">Application Close</span>
                    <input
                      type="date"
                      id="closeDate"
                      name="closeDate"
                      placeholder="Enter application close date"
                      autoComplete="off"
                      value={job.closeDate}
                      onChange={handleInputs}
                      required
                    />
                  </div>
                </div>
                <div className="job-details">
                  <input
                    type="radio"
                    name="jobType"
                    value="Full Time"
                    id="dot-1"
                    checked={job.jobType === "Full Time"}
                    onChange={handleInputs}
                  />
                  <input
                    type="radio"
                    name="jobType"
                    value="Part Time"
                    id="dot-2"
                    checked={job.jobType === "Part Time"}
                    onChange={handleInputs}
                  />
                  <input
                    type="radio"
                    name="jobType"
                    value="Both"
                    id="dot-3"
                    checked={job.jobType === "Both"}
                    onChange={handleInputs}
                  />
                  <span className="field-title">Job Type</span>
                  <div className="category">
                    <label htmlFor="dot-1">
                      <span className="dot one"></span>
                      <span className="field">Full Time</span>
                    </label>
                    <label htmlFor="dot-2">
                      <span className="dot two"></span>
                      <span className="field">Part Time</span>
                    </label>
                    <label htmlFor="dot-3">
                      <span className="dot three"></span>
                      <span className="field">Both</span>
                    </label>
                  </div>
                </div>

                <div className="job-details">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={job.gender === "Male"}
                    onChange={handleInputs}
                    id="dot-4"
                  />
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={job.gender === "Female"}
                    onChange={handleInputs}
                    id="dot-5"
                  />
                  <input
                    type="radio"
                    name="gender"
                    value="Both"
                    checked={job.gender === "Both"}
                    onChange={handleInputs}
                    id="dot-6"
                  />
                  <span className="gender-title">Gender</span>
                  <div className="category">
                    <label htmlFor="dot-4">
                      <span className="dot four"></span>
                      <span className="gender">Male</span>
                    </label>
                    <label htmlFor="dot-5">
                      <span className="dot five"></span>
                      <span className="gender">Female</span>
                    </label>
                    <label htmlFor="dot-6">
                      <span className="dot six"></span>
                      <span className="gender">Both</span>
                    </label>
                  </div>
                </div>

                <div className="button">
                  <input type="submit" value="Update" onClick={updateJob} />
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

export default UpdateJob;
