import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const callProfilePage = async () => {
    try {
      const res = await fetch("/profile", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      setUserData(data);
      setLoading(false);
      if (res.status !== 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (err) {
      toast.warn("Please First Login");
      console.log(err);
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    setLoading(true);
    callProfilePage();
  }, []);

  const handleUpdate = (id, role) => {
    if (role === 0) {
      //company
      navigate(`/updatecompany/${id}`, { replace: true });
    } else {
      //admin or applicant
      navigate(`/updateapplicant/${id}`, { replace: true });
    }
  };

  const handleInputsfiles = (e) => {
    console.log(e.target.files[0]);
    setPhoto(e.target.files[0]);
  };

  const handleImage = async (id) => {
    const formData = new FormData();
    formData.append("photo", photo);

    const res = await fetch(`/changePhoto/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (res.status === 200) {
      // window.alert("update photo successful");
      toast.info("photo updated successfully");
      console.log("update photo successful");
      setLoading(true);
      callProfilePage();
    } else {
      toast.error("something went wrong");
      // window.alert("update photo  not successful");
      console.log("update photo  not successful");
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
      {loading ? (
        <Spinner />
      ) : (
        <div className="card-profile">
          <h1 className="card-title">Profile</h1>
          {userData && userData.role !== 0 && (
            <div className="profile-photo">
              <img src={userData.photo} alt="Profile Photos" />
            </div>
          )}
          <div className="card-body">
            <div className="user-data">
              {userData && (
                <>
                  {(userData.role === 1 || userData.role === 2) && (
                    <p>
                      <strong>Name:</strong> {userData.name}
                    </p>
                  )}

                  {userData.role === 0 && (
                    <p>
                      <strong>Company Name:</strong> {userData.companyName}
                    </p>
                  )}
                  {userData.role === 0 && (
                    <p>
                      <strong>contactPersonName:</strong>{" "}
                      {userData.contactPersonName}
                    </p>
                  )}

                  <p>
                    <strong>Email:</strong> {userData.email}
                  </p>
                  <p>
                    <strong>Mobile:</strong> {userData.mobile}
                  </p>

                  {userData.role === 0 && (
                    <p>
                      <strong>State:</strong> {userData.state}
                    </p>
                  )}
                  {userData.role === 0 && (
                    <p>
                      <strong>City:</strong> {userData.city}
                    </p>
                  )}
                  {(userData.role === 1 || userData.role === 2) && (
                    <p>
                      <strong>Date of Birth:</strong> {formatDate(userData.dob)}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="card-footer">
            <button
              className="btn btn-primary"
              onClick={() => handleUpdate(userData._id, userData.role)}
            >
              Update
            </button>
            {userData && userData.role !== 0 && (
              <div className="handlephoto">
                <input
                  type="file"
                  name="photo"
                  id="photo"
                  onChange={handleInputsfiles}
                  required
                />
                <button
                  className="btn btn-secondary"
                  onClick={() => handleImage(userData._id)}
                >
                  Change Photo
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default Profile;
