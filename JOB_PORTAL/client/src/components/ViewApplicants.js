import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewApplicants = () => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchApplicants = async () => {
    try {
      const res = await fetch("/getApplicants", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      if (res.status === 200) {
        toast.success("applicant fetch successfully");
        console.log("Applicant fetch successfully");
        // window.alert("applicant fetch successfully");
        setApplicants(data);
        setLoading(false);
      } else {
        // toast.error("somethimg went wrong");
        console.log("Applicant is not fetch successfully");
        // window.alert("applicant is not fetch successfully");
        const error = new Error(res.error);
        throw error;
      }
    } catch (err) {
      toast.error("somethimg went wrong");
      console.log(err);
      navigate("/login", { replace: true });
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/applicant/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result) {
        toast.success("Applicant deleted successfully");
        // window.alert("deleted successfully");
        setLoading(true);
        fetchApplicants();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchApplicants();
  }, []);

  const handleSearch = async (e) => {
    setLoading(true);
    const key = e.target.value;

    if (key) {
      const res = await fetch(`/searchApplicant/${key}`, {
        method: "GET",
      });

      if (res.status === 200) {
        // window.alert("application fetch successfully");
        const data = await res.json();
        setApplicants(data);
        setLoading(false);
      } else {
        toast.error("somethimg went wrong");
        // window.alert("application not fetch successfully");
        console.log("applicant not fetch successfully");
      }
    } else {
      setLoading(true);
      fetchApplicants();
    }
  };

  //for format date yyyy-mm-dd
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
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
                applicants.map(
                  (applicant, i) =>
                    applicant.role !== 2 && (
                      <div key={i} className="card">
                        <p>
                          {" "}
                          <img
                            className="profile-photo"
                            src={applicant.photo}
                            alt="fetimg"
                            width="200px"
                          />
                        </p>
                        <h2>Name : {applicant.name}</h2>
                        <p>
                          <b>Email : </b>
                          {applicant.email}
                        </p>
                        <p>
                          <b>Mobile : </b>
                          {applicant.mobile}
                        </p>
                        <p>
                          <b>Dob : </b>
                          {formatDate(applicant.dob)}
                        </p>
                        <button
                          className="bttn"
                          id="dlt-bttn"
                          onClick={() => handleDelete(applicant._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )
                )
              )}
            </div>
          </div>
        </main>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default ViewApplicants;
