import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { FileText, ClipboardList, Upload, CreditCard, CheckCircle } from "lucide-react";
import BuildingSketch from "../../../assets/Applicant/Building-Sketch.png";

const steps = [
  { id: 1, title: "Download The Form", icon: <FileText />, isCompleted: true },
  { id: 2, title: "Application Category", icon: <ClipboardList />, isCompleted: true },
  { id: 3, title: "Upload Evidence", icon: <Upload />, isCompleted: true },
  { id: 4, title: "Choose Research Type", icon: <ClipboardList />, isActive: true, isCompleted: false },
  { id: 5, title: "Make Payment", icon: <CreditCard />, isActive: false, isCompleted: false },
  { id: 6, title: "Finish Submission", icon: <CheckCircle />, isActive: false, isCompleted: false }
];

const ChooseResearchType = () => {
const navigate = useNavigate(); // Initialize navigation hook
  const [researchType, setResearchType] = useState("");

  return (
    <div
      className="min-h-screen flex flex-col items-center p-8 bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${BuildingSketch})` }}
    >
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-blue-900 text-center">
        Submit Your Application
      </h2>
      <p className="text-blue-600 text-lg mt-2">Choose Research Type</p>

      {/* Progress Steps */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 mt-6">
        <div className="flex justify-between items-center border-b pb-4">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold 
                ${step.isCompleted ? "bg-green-500" : step.isActive ? "bg-blue-900" : "bg-gray-300"}`}
              >
                {step.isCompleted ? "✔" : step.id}
              </div>
              <p className={`text-xs mt-2 text-center ${step.isActive ? "text-blue-900 font-semibold" : "text-gray-500"}`}>
                {step.title}
              </p>
            </div>
          ))}
        </div>

        {/* Research Type Selection */}
        <div className="mt-6 bg-gray-100 border border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-700">
            Specify the type of research you are conducting (e.g., human, animal, observational) 
            to guide the ethics review process.
          </p>

          {/* Dropdown Selection */}
          <div className="mt-4">
            <select
              className="w-full px-4 py-3 rounded-lg border border-gray-400 bg-white text-gray-700 cursor-pointer"
              value={researchType}
              onChange={(e) => setResearchType(e.target.value)}
            >
              <option value="" disabled>Choose...</option>
              <option value="Human">Human Research</option>
              <option value="Animal">Animal Research</option>
              <option value="Observational">Observational Research</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button 
         onClick={() => navigate("/submit-application/upload-evidence")} // Navigate on click
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg shadow-lg">
            ← Back
          </button>
          <button
         onClick={() => navigate("/submit-application/make-payment")} // Navigate on click
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

export default ChooseResearchType;
