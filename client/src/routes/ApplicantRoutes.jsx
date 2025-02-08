import { Routes, Route } from "react-router-dom";
import Header from "../components/Applicant/general/Header";
import Home from "../pages/Applicant/Home";
import Guidelines from "../pages/Applicant/Guidelines";
import ApplicationProcess from "../pages/Applicant/AplicationProcess";
import ContactSupport from "../pages/Applicant/ContactSupport";
import Login from "../pages/Applicant/Login";
import SignUp from "../pages/Applicant/SignUp";
import SubmitApplication from "../pages/Applicant/SubmitApplication";
import TrackApplication from "../pages/Applicant/TrackApplication";

const ApplicantRoutes = () => {
  return (
    <>
      <Header />
      <Routes>
        {/* route: general */}
        <Route path="/" element={<Home />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/application" element={<ApplicationProcess />} />
        <Route path="/support" element={<ContactSupport />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/submit-application" element={<SubmitApplication />} />
        <Route path="/track-application" element={<TrackApplication />} />

        {/* add other routes below */}
      </Routes>
    </>
  );
};

export default ApplicantRoutes;
