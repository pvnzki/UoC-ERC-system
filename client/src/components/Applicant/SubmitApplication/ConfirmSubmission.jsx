import React from "react";
import { FileText, ClipboardList, Upload, CreditCard, CheckCircle } from "lucide-react";
import BuildingSketch from "../../../assets/Applicant/Building-Sketch.png";

const steps = [
  { id: 1, title: "Download The Form", icon: <FileText />, isCompleted: true },
  { id: 2, title: "Application Category", icon: <ClipboardList />, isCompleted: true },
  { id: 3, title: "Upload Evidence", icon: <Upload />, isCompleted: true },
  { id: 4, title: "Choose Research Type", icon: <ClipboardList />, isCompleted: true },
  { id: 5, title: "Make Payment", icon: <CreditCard />, isCompleted: true },
  { id: 6, title: "Finish Submission", icon: <CheckCircle />, isActive: true, isCompleted: false }
];

const ConfirmSubmission = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center p-8 bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${BuildingSketch})` }}
    >
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-blue-900 text-center">
        Submit Your Application
      </h2>
      <p className="text-blue-600 text-lg mt-2">Confirm Submission</p>

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

        {/* Confirmation Message */}
        <div className="mt-6 bg-gray-100 border border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-700 text-lg">
            Review all details, confirm accuracy, and submit your application. 
            You will receive a confirmation upon successful submission.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg shadow-lg">
            ← Back
          </button>
          <button
            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-2 rounded-lg shadow-lg 
                      transition-transform duration-300 transform hover:scale-105 hover:from-green-600 hover:to-green-800"
          >
            Finish →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSubmission;
