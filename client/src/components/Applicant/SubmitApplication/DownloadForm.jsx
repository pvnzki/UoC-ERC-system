import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { FileText, Upload, ClipboardList, CreditCard, CheckCircle } from "lucide-react";
import BuildingSketch from "../../../assets/Applicant/Building-Sketch.png";

const steps = [
  { id: 1, title: "Download The Form", icon: <FileText />, isActive: true },
  { id: 2, title: "Application Category", icon: <ClipboardList />, isActive: false },
  { id: 3, title: "Upload Evidence", icon: <Upload />, isActive: false },
  { id: 4, title: "Choose Research Type", icon: <ClipboardList />, isActive: false },
  { id: 5, title: "Make Payment", icon: <CreditCard />, isActive: false },
  { id: 6, title: "Finish Submission", icon: <CheckCircle />, isActive: false }
];

const SubmitApplication = () => {
  const navigate = useNavigate(); // Initialize navigation hook

  return (
    <div
      className="min-h-screen flex flex-col items-center p-8 bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${BuildingSketch})` }}
    >
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-blue-900 text-center">
        Submit Your Application
      </h2>
      <p className="text-blue-600 text-lg mt-2">Download The Form</p>

      {/* Progress Steps */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 mt-6">
        <div className="flex justify-between items-center border-b pb-4">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold 
                ${step.isActive ? "bg-blue-900" : "bg-gray-300"}`}
              >
                {step.id}
              </div>
              <p className={`text-xs mt-2 text-center ${step.isActive ? "text-blue-900 font-semibold" : "text-gray-500"}`}>
                {step.title}
              </p>
            </div>
          ))}
        </div>

        {/* Instruction Box */}
        <div className="mt-6 bg-gray-100 border border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-700">
            Start by downloading the application form to begin the submission process.
            Ensure you have the correct version for your research type.
          </p>

          {/* Download PDF Button */}
          <div className="mt-4">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg">
              Download PDF
            </button>
          </div>
        </div>

        {/* Next Button with Navigation */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/submit-application/choose-category")} // Navigate on click
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg shadow-lg 
                      transition-transform duration-300 transform hover:scale-105 hover:from-blue-600 hover:to-blue-800"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitApplication;
