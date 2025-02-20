import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApplicantRoutes from "./routes/ApplicantRoutes";
import CTSCorARWSChairRoutes from "./routes/CTSCorARWSChairRoutes";
import ERCmainRoutes from "./routes/ERCmainRoutes";
import ERCTechnicalCommitteeRoutes from "./routes/ERCTechnicalCommitteeRoutes";
import OfficeStaffRoutes from "./routes/OfficeStaffRoutes";

const App = () => {
  return (
    <div className="w-full">
      <Router>
        <Routes>
          {/* Applicant Routes */}
          <Route path="/*" element={<ApplicantRoutes />} />

          {/* CTSC/ARWS Chair Routes */}
          <Route path="/chair/*" element={<CTSCorARWSChairRoutes />} />

          {/* ERC main committee/ CTSC/ARWS members Routes */}
          <Route path="/ercmain/*" element={<ERCmainRoutes />} />

          {/* ERC Technical Committee Member Routes */}
          <Route
            path="/erctechnical/*"
            element={<ERCTechnicalCommitteeRoutes />}
          />

          {/* Office Staff Routes */}
          <Route path="/officestaff/*" element={<OfficeStaffRoutes />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
