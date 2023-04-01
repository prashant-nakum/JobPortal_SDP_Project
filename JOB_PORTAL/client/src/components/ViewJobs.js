import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "./Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewJobs = () => {
  // const params = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [currentrole, setCurrentrole] = useState();
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(); 

  const fetchJobs = async () => {
    try {
      const res = await fetch("/getJobs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      if (res.status === 200) {
        // toast.success("Jobs fetch successfully");
        console.log("Jobs fetch successfully");
        setJobs(data);
        setCurrentrole(data[data.length - 1].currentrole);
        setLoading(false);
      } else {
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
      const res = await fetch(`/job/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result) {
        toast.success("Job deleted successfully");
        setLoading(true);
        fetchJobs();
      }
    } catch (err) {
      toast.error("somethimg went wrong");
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchJobs();
    handleHome();
  }, []);

  const handleApply = (email, id) => {
    console.log(email);
    console.log(id);
    navigate("/apply", { state: { data: email, id: id } });
  };

  const handleUpdate = (id) => {
    navigate(`updatejob/${id}`, { replace: true });
  };

  const handleSearch = async (e) => {
    setLoading(true);
    console.log("Here in handle search");
    // console.log(key);
    // setSearchValue(key);
    if(e){ 
      const key = e.target.value;
      console.log("key1 " + key);
    setSearchValue(key);
    }
    console.log("searchValue " + searchValue);
    if (searchValue) {    
      const res = await fetch(`/searchJob/${searchValue}`, {
        method: "GET",
      });

      if (res.status === 200) {
        const data = await res.json();
        setJobs(data);
        setLoading(false);
      } else {
        toast.error("somethimg went wrong");
        console.log("job not fetch successfully");
      }
    }
    else {
      setLoading(true);
      console.log("Here in handle search else part");
      fetchJobs();
    }
  };

  const handleHome =  () => {
    const searchParams = new URLSearchParams(window.location.search);
    const qparam = searchParams.get('qparam');
    if(qparam){
      console.log("in qparam home " + qparam);
      setSearchValue(qparam);
      console.log("in handle home " + searchValue);
      handleSearch();
    }
  }


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
            value={searchValue}
            onChange={handleSearch}
          />
        </div>
        <main className="sec bd">
          <div id="sec">
            <div className="cards">
              {loading ? (
                <Spinner />
              ) : (
                jobs.slice(0, jobs.length - 1).map((job, i) => (
                  <div key={i} className="card">
                    <h2>Company Name : {job.companyName}</h2>
                    <p>
                      <b>Email : </b>
                      {job.email}
                    </p>
                    <p>
                      <b>JobType : </b>
                      {job.jobType}
                    </p>
                    <p>
                      <b>FieldType : </b>
                      {job.fieldTypes}
                    </p>
                    <p>
                      <b>Gender : </b>
                      {job.gender}
                    </p>
                    <p>
                      <b>Experience : </b>
                      {job.experience}
                    </p>
                    <p>
                      <b>Salary : </b>
                      {job.salary}
                    </p>
                    <p>
                      <b>OpenDate : </b>
                      {formatDate(job.openDate)}
                    </p>
                    <p>
                      <b>CloseDate : </b>
                      {formatDate(job.closeDate)}
                    </p>
                    <p>
                      <b>City : </b>
                      {job.city}
                    </p>
                    <p>
                      <b>State : </b>
                      {job.state}
                    </p>
                    <p>
                      <b>AgeLimit : </b>
                      {job.ageLimit}
                    </p>
                    <p>
                      <b>Vacancies : </b>
                      {job.vacancies}
                    </p>
                    <p>
                      <b>Skills : </b>
                      {job.skills}
                    </p>
                    <p>
                      <b>Qualification : </b>
                      {job.qualification}
                    </p>
                    {currentrole === 1 && (
                      <button
                        className="bttn"
                        id="grbttn"
                        onClick={() => handleApply(job.email, job._id)}
                      >
                        Apply
                      </button>
                    )}
                    {currentrole === 0 && (
                      <button
                        className="bttn"
                        id="grbttn"
                        onClick={() => handleUpdate(job._id)}
                      >
                        Update
                      </button>
                    )}
                    {(currentrole === 0 || currentrole === 2) && (
                      <button
                        className="bttn"
                        onClick={() => handleDelete(job._id)}
                      >
                        Delete
                      </button>
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

export default ViewJobs;
