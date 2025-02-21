import React from "react";
import { X, Check } from "lucide-react";
import pdf from "../../../assets/OfficeStaff/Group 4.png";
import cancle from "../../../assets/OfficeStaff/Cancel.png";
import tick from "../../../assets/OfficeStaff/Check Mark.png";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {children}
  </div>
);

const ApplicationDetails = () => {
  const applicationDetails = {
    userName: "....................",
    userId: "........",
    userEmail: ".............",
    applicationCategory: ".....",
    researchType: ".....",
    applyDate: ".....",
    applyTime: ".....",
  };

  const documents = [
    { id: 1, name: "Document 1", fileName: "research-resources.pdf" },
    { id: 2, name: "Document 2", fileName: "proposal.pdf" },
    { id: 3, name: "Document 3", fileName: "cv.pdf" },
    { id: 4, name: "Document 4", fileName: "research-consent-form.pdf" },
    { id: 5, name: "Payment Slip", fileName: "payment636383.pdf" },
  ];

  return (
    <div className="w-full  bg-gray-100 p-6 rounded-lg shadow-md overflow-y-auto h-screen pb-20">
      <Card>
        <h2 className="text-xl font-semibold mb-2">Applicant Details</h2>
        <div className="border-b pb-4 mb-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p>
              <strong>User Name:</strong> {applicationDetails.userName}
            </p>
            <p>
              <strong>User ID:</strong> {applicationDetails.userId}
            </p>
            <p>
              <strong>User Email:</strong> {applicationDetails.userEmail}
            </p>
            <p>
              <strong>Application Category:</strong>{" "}
              {applicationDetails.applicationCategory}
            </p>
            <p>
              <strong>Research Type:</strong> {applicationDetails.researchType}
            </p>
          </div>
          <div>
            <p>
              <strong>Apply Date:</strong> {applicationDetails.applyDate}
            </p>
            <p>
              <strong>Apply Time:</strong> {applicationDetails.applyTime}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-3">Documents</h2>
        <div className="space-y-3 p-2 px-10">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-1 px-10 border-2 border-gray-300 rounded-3xl bg-gray-50"
            >
              {/* Document Title (Predefined) */}
              <p className="font-medium text-lg w-32 border-r-2 border-r-gray-300 mr-10">
                {doc.name}
              </p>

              {/* PDF Icon */}
              <div className=" text-xs font-medium px-2 py-1 rounded-md pl-10">
                <img src={pdf} className="w-10 h-10" />
              </div>

              {/* File Name */}
              <p className="text-md text-gray-500 flex-1 truncate ml-3">
                {doc.fileName}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="p-2 rounded-full hover:bg-red-100">
                  <img src={cancle} className="w-10 h-10" />
                </button>
                <button className="p-2 rounded-full hover:bg-green-100">
                  <img src={tick} className="w-10 h-10" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ApplicationDetails;
