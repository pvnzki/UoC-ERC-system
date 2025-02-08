import { Routes, Route } from "react-router-dom";
import Header from "../components/Applicant/general/Header";
import Home from "../pages/Applicant/Home";
import Guidelines from "../pages/Applicant/Guidelines";
import ApplicationProcess from "../pages/Applicant/AplicationProcess";
import ContactSupport from "../pages/Applicant/ContactSupport";

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


        {/* add other routes below */}
      </Routes>
    </>
  );
};

export default ApplicantRoutes;
