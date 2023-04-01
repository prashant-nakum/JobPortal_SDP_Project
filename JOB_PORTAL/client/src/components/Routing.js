import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import ViewApplications from "./ViewApplications";
import Contact from "./Contact";
import Login from "./Login";
import Profile from "./Profile";
import CompanyRegister from "./CompanyRegister";
import ApplicantRegister from "./ApplicantRegister";
import ApplicationForm from "./ApplicationForm";
import AddJob from "./AddJob";
import Logout from "./Logout";
import ViewJobs from "./ViewJobs";
import ViewApplicants from "./ViewApplicants";
import ViewCompany from "./ViewCompany";
import UpdateApplication from "./UpdateApplication";
import UpdateCompany from "./UpdateCompany";
import UpdateApplicant from "./UpdateApplicant";
import UpdateJob from "./UpdateJob";
import AcceptApplication from "./AcceptApplication";
import ViewMessage from "./ViewMessage";
import NoPage from "./NoPage";

const Routing = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<Home />} />
            <Route path="applications" element={<ViewApplications />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="profile" element={<Profile />} />
            <Route path="companyRegister" element={<CompanyRegister />} />
            <Route path="applicantRegister" element={<ApplicantRegister />} />
            <Route path="apply" element={<ApplicationForm />} />
            <Route path="addJob" element={<AddJob />} />
            <Route path="acceptApplication" element={<AcceptApplication />} />
            <Route path="logout" element={<Logout />} />
            <Route path="viewjob" element={<ViewJobs />} />
            <Route path="viewjob/:searchTerm" element={<ViewJobs />} />
            <Route path="viewapplicants" element={<ViewApplicants />} />
            <Route path="viewcompany" element={<ViewCompany />} />
            <Route path="updatecompany/:id" element={<UpdateCompany />} />
            <Route path="viewjob/updatejob/:id" element={<UpdateJob />} />
            <Route
              path="applications/updateapplication/:id"
              element={<UpdateApplication />}
            />
            <Route path="updateapplicant/:id" element={<UpdateApplicant />} />
            <Route path="viewcontact" element={<ViewMessage />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Routing;
