import { Routes, Route } from "react-router-dom";
import Header from "../components/Applicant/general/Header";
import Home from "../pages/Applicant/Home";

const ApplicantRoutes = () => {
  return (
    <>
      <Header />
      <Routes>
        {/* route: general */}
        <Route path="/" element={<Home />} />

        {/* add other routes below */}
      </Routes>
    </>
  );
};

export default ApplicantRoutes;
