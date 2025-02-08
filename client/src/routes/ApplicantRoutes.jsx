import { Routes, Route } from "react-router-dom";
import Header from "../components/Applicant/general/Header";
import Home from "../pages/Applicant/Home";
import Guidelines from "../pages/Applicant/Guidelines";
import ApplicationProcess from "../pages/Applicant/AplicationProcess";

const ApplicantRoutes = () => {
  return (
    <>
      <Header />
      <Routes>
        {/* route: general */}
        <Route path="/" element={<Home />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/application" element={<ApplicationProcess />} />


        {/* add other routes below */}
      </Routes>
    </>
  );
};

export default ApplicantRoutes;
