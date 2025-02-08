import React, { useState } from "react";
import { FileText, ClipboardList, Upload, CreditCard, CheckCircle } from "lucide-react";
import BuildingSketch from "../../../assets/Applicant/Building-Sketch.png";

const steps = [
  { id: 1, title: "Download The Form", icon: <FileText />, isCompleted: true },
  { id: 2, title: "Application Category", icon: <ClipboardList />, isActive: true, isCompleted: false },
  { id: 3, title: "Upload Evidence", icon: <Upload />, isActive: false, isCompleted: false },
  { id: 4, title: "Choose Research Type", icon: <ClipboardList />, isActive: false, isCompleted: false },
  { id: 5, title: "Make Payment", icon: <CreditCard />, isActive: false, isCompleted: false },
  { id: 6, title: "Finish Submission", icon: <CheckCircle />, isActive: false, isCompleted: false }
];

const ChooseCategory = () => {
  const [category, setCategory] = useState("");

  return (
    <div
      className="min-h-screen flex flex-col items-center p-8 bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${BuildingSketch})` }}
    >
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-blue-900 text-center">
        Submit Your Application
      </h2>
      <p className="text-blue-600 text-lg mt-2">Choose Application Category</p>

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

        {/* Category Selection */}
        <div className="mt-6 bg-gray-100 border border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-700">
            Select the appropriate category for your research (e.g., clinical, biomedical, social sciences)
            to ensure it is reviewed by the correct panel.
          </p>

          {/* Dropdown Selection */}
          <div className="mt-4">
            <select
              className="w-full px-4 py-3 rounded-lg border border-gray-400 bg-white text-gray-700 cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>Choose...</option>
              <option value="Clinical">Clinical</option>
              <option value="Biomedical">Biomedical</option>
              <option value="Social Sciences">Social Sciences</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg shadow-lg">
            ← Back
          </button>
          <button
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

export default ChooseCategory;
