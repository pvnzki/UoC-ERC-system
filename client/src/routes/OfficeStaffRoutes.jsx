import { Routes, Route } from "react-router-dom";
import Home from "../pages/OfficeStaff/Office_Home.jsx";
import Office_Header from "../components/OfficeStaff/genaral/Office_Header.jsx";
import Sidebar from "../components/OfficeStaff/genaral/SideBar.jsx";
const CTSCorARWSChairRoutes = () => {
  return (
    <>
      <Office_Header />
      <Sidebar />
      <Routes>
        {/* route: general */}
        {/* <Route path="/" element={<Home />} /> */}

        {/* add other routes below */}
      </Routes>
    </>
  );
};

export default CTSCorARWSChairRoutes;
