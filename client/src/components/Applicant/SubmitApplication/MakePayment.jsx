import React, { useState } from "react";
import { FileText, ClipboardList, Upload, CreditCard, CheckCircle, UploadCloud } from "lucide-react";
import BuildingSketch from "../../../assets/Applicant/Building-Sketch.png";

const steps = [
  { id: 1, title: "Download The Form", icon: <FileText />, isCompleted: true },
  { id: 2, title: "Application Category", icon: <ClipboardList />, isCompleted: true },
  { id: 3, title: "Upload Evidence", icon: <Upload />, isCompleted: true },
  { id: 4, title: "Choose Research Type", icon: <ClipboardList />, isCompleted: true },
  { id: 5, title: "Make Payment", icon: <CreditCard />, isActive: true, isCompleted: false },
  { id: 6, title: "Finish Submission", icon: <CheckCircle />, isActive: false, isCompleted: false }
];

const MakePayment = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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
      <p className="text-blue-600 text-lg mt-2">Make Payment</p>

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

        {/* Upload Section */}
        <div className="mt-6 bg-gray-100 border border-gray-300 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800">Upload the Receipt of the Payment</h3>

          <label className="mt-4 flex flex-col items-center border-2 border-dashed border-gray-400 bg-white rounded-lg p-6 cursor-pointer">
            <UploadCloud className="text-blue-500 w-10 h-10" />
            <p className="text-gray-700 mt-2">Browse Files to upload</p>
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>

          {selectedFile && (
            <div className="mt-4 flex justify-center items-center bg-gray-200 p-2 rounded-lg">
              <FileText className="text-gray-600 w-5 h-5 mr-2" />
              <p className="text-gray-700">{selectedFile.name}</p>
            </div>
          )}
        </div>

        {/* Summary Box */}
        <div className="mt-6 flex justify-between">
          <div></div> {/* Empty div for alignment */}
          <div className="border border-gray-300 rounded-lg bg-gray-100 p-4 w-64">
            <h4 className="text-lg font-semibold text-gray-800">Summary</h4>
            <div className="mt-2 text-gray-700">
              <p className="flex justify-between">
                <span>Application Submission Fee</span>
                <span>Rs. 10,000.00</span>
              </p>
              <p className="flex justify-between">
                <span>Application Review Fee</span>
                <span>Rs. 15,000.00</span>
              </p>
              <hr className="my-2 border-gray-400" />
              <p className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. 25,000.00</span>
              </p>
              <p className="flex justify-between">
                <span>Other Fee</span>
                <span>Rs. 550.00</span>
              </p>
              <hr className="my-2 border-gray-400" />
              <p className="flex justify-between font-bold text-blue-900">
                <span>Total</span>
                <span>Rs. 25,550.00</span>
              </p>
            </div>
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

export default MakePayment;
