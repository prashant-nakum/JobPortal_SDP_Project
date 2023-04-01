import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewApplications = () => {
  const navigate = useNavigate();
  const [currentrole, setCurrentrole] = useState();
  const [applications, setApplications] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const getApplications = async () => {
    try {
      const res = await fetch("/getApplications", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.status === 200) {
        // window.alert("application fetch successfully");
        console.log("application fetch successfully");
        const data = await res.json();
        console.log(data);
        console.log("data.hired", data.hired);
        setApplications(data);
        setCurrentrole(data[data.length - 1].currentrole);
        setLoading(false);
      } else {
        // toast.error("somethimg went wrong");
        // window.alert("application not fetch successfully");
        console.log("application not fetch successfully");
        const error = new Error(res.error);
        throw error;
      }
    } catch (err) {
      toast.error("somethimg went wrong");
      console.log(err);
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    setLoading(true);
    getApplications();
  }, []);

  const downloadPdfAtUrl = (url) => {
    const fileName = url.split("/").pop();
    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  const handleDelete = async (id) => {
    window.alert("Delete clicked");
    try {
      const res = await fetch(`/application/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result) {
        toast.success("Application deleted successfully");
        // window.alert("deleted successfully");
        setLoading(true);
        getApplications();
      }
    } catch (err) {
      toast.error("somethimg went wrong");
      console.log(err);
    }
  };

  const handleUpdate = (id) => {
    navigate(`updateapplication/${id}`, { replace: true });
  };

  const handleResume = async (id) => {
    const formData = new FormData();
    formData.append("resume", resume);

    const res = await fetch(`/changeResume/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (res.status === 200) {
      toast.success("Resume updated successfully");
      // window.alert("update resume successful");
      console.log("update resume successful");
    } else {
      toast.error("somethimg went wrong");
      // window.alert("update resume  not successful");
      console.log("update resume  not successful");
    }
  };

  const handleAcceptApplication = async (id, hired) => {
    try {
      const res = await fetch(`/acceptapp/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hired,
        }),
      });
      const msg = await res.json();
      console.log(msg);
      if (res.status === 200) {
        setLoading(true);
        getApplications();
        toast.success("Application accepted");
        // window.alert("application accepted");
      } else {
        toast.error("somethimg went wrong");
        // window.alert("application not accepted");
      }
    } catch (err) {
      toast.error("somethimg went wrong");
      console.log(err);
    }
  };

  const handleInputsfiles = (e) => {
    console.log(e.target.files[0]);
    setResume(e.target.files[0]);
  };

  const handleSearch = async (e) => {
    setLoading(true);
    const key = e.target.value;

    if (key) {
      const res = await fetch(`/searchApplication/${key}`, {
        method: "GET",
      });

      if (res.status === 200) {
        // window.alert("application fetch successfully");
        const data = await res.json();
        console.log(data);
        setApplications(data);
        setLoading(false);
        // setCurrentrole(data[data.length-1].currentrole);
      } else {
        toast.error("somethimg went wrong");
        // window.alert("application not fetch successfully");
        console.log("application not fetch successfully");
      }
    } else {
      setLoading(true);
      getApplications();
    }
  };

  return (
    <>
      <div>
        <div className="search__container space">
          <input
            className="search__input"
            type="text"
            placeholder="Search"
            onChange={handleSearch}
          />
        </div>
        <main className="sec bd">
          <div id="sec">
            <div className="cards">
              {loading ? (
                <Spinner />
              ) : (
                applications
                  .slice(0, applications.length - 1)
                  .map((application, i) => (
                    <div key={i} className="card">
                      <h2>Applicant Name : {application.name}</h2>
                      <p>
                        <b>Applicant Email : </b>
                        {application.email}
                      </p>
                      <p>
                        <b>Applicant Mobile : </b>
                        {application.mobile}
                      </p>
                      <p>
                        <b>Company Name : </b>
                        {application.company_id.companyName}
                      </p>
                      <p>
                        <b>Company Mobile : </b>
                        {application.mobile}
                      </p>
                      <p>
                        <b>Company Person Name : </b>
                        {application.company_id.contactPersonName}
                      </p>

                      <p>
                        <b>Company_Email : </b>
                        {application.company_email}
                      </p>

                      {currentrole === 0 && (
                        <>
                          {application.hired === 0 && (
                            <>
                              <button
                                className="bttn"
                                id="grbttn"
                                onClick={() =>
                                  handleAcceptApplication(application._id, 1)
                                }
                              >
                                Accept
                              </button>
                              <button
                                className="bttn"
                                onClick={() =>
                                  handleAcceptApplication(application._id, 2)
                                }
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {application.hired === 1 && (
                            <h4 className="acceptedApp">Accepted</h4>
                          )}
                          {application.hired === 2 && (
                            <h4 className="acceptedApp">Rejected</h4>
                          )}
                        </>
                      )}
                      {(currentrole === 1 ||
                        currentrole === 2 ||
                        (application.hired !== 0 && currentrole === 0)) && (
                        <button
                          className="bttn"
                          onClick={() => handleDelete(application._id)}
                        >
                          Delete
                        </button>
                      )}
                      {currentrole === 0 && application.hired === 0 && (
                        <button
                          id="grbttn"
                          className="bttn"
                          onClick={() => {
                            downloadPdfAtUrl(application.resume);
                          }}
                        >
                          Download Resume
                        </button>
                      )}
                      {application.hired === 0 && (
                        <>
                          {currentrole === 1 && (
                            <button
                              className="bttn"
                              id="grbttn"
                              onClick={() => handleUpdate(application._id)}
                            >
                              Update
                            </button>
                          )}
                          {currentrole === 1 && (
                            <div className="update-resume">
                              <button
                                className="bttn"
                                id="grbttn"
                                onClick={() => handleResume(application._id)}
                              >
                                Update Resume
                              </button>
                              <input
                                type="file"
                                className="input-resume"
                                name="resume"
                                id="resume"
                                onChange={handleInputsfiles}
                                required
                              />
                            </div>
                          )}
                        </>
                      )}
                      {currentrole === 1 && (
                        <>
                          {application.hired === 1 && (
                            <h4 className="acceptedApp">Accepted</h4>
                          )}
                          {application.hired === 2 && (
                            <h4 className="acceptedApp">Rejected</h4>
                          )}
                        </>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>
        </main>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default ViewApplications;
