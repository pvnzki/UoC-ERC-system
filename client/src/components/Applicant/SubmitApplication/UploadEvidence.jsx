import React, { useState } from "react";
import { FileText, Upload, ClipboardList, CreditCard, CheckCircle } from "lucide-react";
import BuildingSketch from "../../../assets/Applicant/Building-Sketch.png";

const steps = [
  { id: 1, title: "Download The Form", icon: <FileText />, isActive: true, isCompleted: true },
  { id: 2, title: "Application Category", icon: <ClipboardList />, isActive: true, isCompleted: true },
  { id: 3, title: "Upload Evidence", icon: <Upload />, isActive: true, isCompleted: false },
  { id: 4, title: "Choose Research Type", icon: <ClipboardList />, isActive: false, isCompleted: false },
  { id: 5, title: "Make Payment", icon: <CreditCard />, isActive: false, isCompleted: false },
  { id: 6, title: "Finish Submission", icon: <CheckCircle />, isActive: false, isCompleted: false }
];

const UploadEvidence = () => {
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-8 bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${BuildingSketch})` }}
    >
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-blue-900 text-center">
        Submit Your Application
      </h2>
      <p className="text-blue-600 text-lg mt-2">Upload Evidence</p>

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

        {/* File Upload Section */}
        <div className="mt-6 bg-gray-100 border border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-700">
            Upload supporting documents such as research protocols, informed consent forms, and any necessary evidence to support your ethical review.
          </p>

          {/* Upload Box */}
          <div className="mt-4 border-dashed border-2 border-gray-400 rounded-lg p-6 flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400" />
            <p className="text-gray-600 mt-2">Choose a file or drag & drop it here</p>
            <p className="text-sm text-gray-500">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>

            {/* File Input */}
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              id="fileUpload"
            />
            <label
              htmlFor="fileUpload"
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg cursor-pointer shadow-lg"
            >
              Browse File
            </label>

            {/* Show Uploaded File Name */}
            {file && <p className="mt-3 text-sm text-gray-700">Selected File: {file.name}</p>}
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

export default UploadEvidence;
