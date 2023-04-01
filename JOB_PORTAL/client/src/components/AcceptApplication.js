import React from "react";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "./Spinner";

const AcceptApplication = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAcceptedApplication = async () => {
    try {
      const res = await fetch("/getAcceptedApplication", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.status === 200) {
        console.log("application fetch successfully");
        const data = await res.json();
        console.log(data);
        setApplications(data);
        setLoading(false);
      } else {
        console.log("application not fetch successfully");
        const error = new Error(res.error);
        throw error;
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    getAcceptedApplication();
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

  return (
    <>
      <div>
        <main className="sec bd">
          <div id="sec">
            <div className="cards">
              {loading ? (
                <Spinner />
              ) : (
                applications.map((application, i) => (
                  <div key={i} className="card">
                    <h3>Name : {application.name}</h3>
                    <p>Email : {application.email}</p>
                    <p>Mobile : {application.mobile}</p>
                    <p>Gender: {application.gender}</p>
                    <p>Age : {application.age}</p>
                    <p>Experience : {application.experience}</p>
                    <p>Qualification : {application.qualification}</p>
                    <p>Skills : {application.skills}</p>
                    <p>Company_Email : {application.company_email}</p>

                    <button
                      id="grbttn"
                      className="bttn"
                      onClick={() => {
                        downloadPdfAtUrl(application.resume);
                      }}
                    >
                      Download Resume
                    </button>
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

export default AcceptApplication;
