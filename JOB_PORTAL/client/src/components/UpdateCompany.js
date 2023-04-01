import { React, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const UpdateCompany = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const [company, setCompany] = useState({
    companyName: "",
    contactPersonName: "",
    email: "",
    mobile: "",
    state: "",
    city: "",
    password: "",
    cpassword: "",
    website: "",
    linkedin: "",
  });

  useEffect(() => {
    // window.alert(params);
    getCompanyDetail();
  }, []);

  const getCompanyDetail = async () => {
    const result = await fetch(`/updatecompany/${params.id}`);
    const data = await result.json();
    // console.log(data);
    setCompany((prevCompany) => ({
      ...prevCompany,
      companyName: data.companyName,
      contactPersonName: data.contactPersonName,
      email: data.email,
      mobile: data.mobile,
      state: data.state,
      city: data.city,
      linkedin: data.linkedin,
      website: data.website,
    }));
  };

  let name, value;
  const handleInputs = (e) => {
    e.preventDefault();
    name = e.target.name;
    value = e.target.value;
    setCompany({ ...company, [name]: value });
  };

  const updateCompany = async (e) => {
    e.preventDefault();

    const {
      companyName,
      contactPersonName,
      email,
      mobile,
      state,
      city,
      password,
      cpassword,
      website,
      linkedin,
    } = company;

    const res = await fetch(`/updatecompany/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        companyName,
        contactPersonName,
        email,
        mobile,
        state,
        city,
        password,
        cpassword,
        website,
        linkedin,
      }),
    });

    // const data = res.json();
    if (res.status === 200) {
      toast.success("Company updated successfully");
      // window.alert("update company successful");
      console.log("update company successful");
      navigate("/profile", { replace: true });
    } else {
      toast.error("Something went wrong");
      // window.alert("update company  not successful");
      console.log("update company  not successful");
    }
  };

  return (
    <>
      <div className="regform-container">
        <div className="regform">
          <div className="container">
            <div className="title">Update Company</div>
            <div className="content">
              <form action="#">
                <div className="user-details">
                  <div className="input-box">
                    <span className="details">companyName</span>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      placeholder="Enter your company name"
                      value={company.companyName}
                      onChange={handleInputs}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span className="details">contactPersonName</span>
                    <input
                      type="text"
                      id="contactPersonName"
                      name="contactPersonName"
                      placeholder="Enter your name"
                      value={company.contactPersonName}
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
                      value={company.email}
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
                      value={company.mobile}
                      onChange={handleInputs}
                      required
                    />
                  </div>

                  <div className="input-box">
                    <span className="details">Password</span>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={company.password}
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
                      value={company.cpassword}
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
                      placeholder="Enter your state"
                      value={company.state}
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
                      placeholder="Enter your city"
                      value={company.city}
                      onChange={handleInputs}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span className="details">Website</span>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      placeholder="Enter your website"
                      value={company.website}
                      onChange={handleInputs}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span className="details">LinkedIn</span>
                    <input
                      type="text"
                      id="linkedin"
                      name="linkedin"
                      placeholder="Enter your linkedin link"
                      value={company.linkedin}
                      onChange={handleInputs}
                      required
                    />
                  </div>
                </div>
                <div className="button">
                  <input type="submit" value="Update" onClick={updateCompany} />
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

export default UpdateCompany;
