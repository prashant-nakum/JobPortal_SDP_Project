import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewCompany = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [currentrole, setCurrentrole] = useState();
  const [loading, setLoading] = useState(false);

  const fetchCompany = async () => {
    try {
      const res = await fetch("/getCompanies", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      if (res.status === 200) {
        console.log("company fetch successfully");
        setCompanies(data);
        setCurrentrole(data[data.length - 1].currentrole);
        setLoading(false);
      } else {
        console.log("company is not fetch successfully");
        // window.alert("company is not fetch successfully");
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
    window.alert("Delete clicked" + id);
    try {
      const res = await fetch(`/company/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result) {
        toast.success("Company deleted successfully");
        // window.alert("deleted successfully");
        setLoading(true);
        fetchCompany();
      }
    } catch (err) {
      toast.error("something went wrong");
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCompany();
  }, []);

  const handleSearch = async (e) => {
    const key = e.target.value;

    if (key) {
      const res = await fetch(`/searchCompany/${key}`, {
        method: "GET",
      });

      if (res.status === 200) {
        // window.alert("application fetch successfully");
        const data = await res.json();
        console.log(data);
        setCompanies(data);
        setLoading(false);
        // setCurrentrole(data[data.length-1].currentrole);
      } else {
        toast.error("somethimg went wrong");
        // window.alert("application not fetch successfully");
        console.log("application not fetch successfully");
      }
    } else {
      setLoading(true);
      fetchCompany();
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
                companies.slice(0, companies.length - 1).map((company, i) => (
                  <div key={i} className="card">
                    <h2>Company Name : {company.companyName}</h2>
                    <p>
                      <b>Person Name: </b>
                      {company.contactPersonName}
                    </p>
                    <p>
                      <b>Email : </b>
                      {company.email}
                    </p>
                    <p>
                      <b>Mobile : </b>
                      {company.mobile}
                    </p>
                    <p>
                      <b>State : </b>
                      {company.state}
                    </p>
                    <p>
                      <b>City : </b>
                      {company.city}
                    </p>
                    <p>
                      <b>Website : </b>
                      {company.website}
                    </p>
                    <p>
                      <b>LinkedIn : </b>
                      {company.linkedin}
                    </p>
                    {currentrole === 2 && (
                      <button
                        className="bttn"
                        onClick={() => handleDelete(company._id)}
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

export default ViewCompany;
