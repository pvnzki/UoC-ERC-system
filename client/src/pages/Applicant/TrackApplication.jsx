import { CheckCircle, FileText, Share2 } from "lucide-react";
import BuildingSketch from "../../assets/Applicant/Building-Sketch.png";

const currentStep = 2; // Set this dynamically based on application status

const steps = [
  { id: 1, title: "Submitted", subtitle: "Application submitted", icon: <FileText /> },
  { id: 2, title: "Review", subtitle: "Under Reviewing Process", icon: <Share2 /> },
  { id: 3, title: "Revisions", subtitle: "Revision requested or not", icon: <FileText /> },
  { id: 4, title: "Approval", subtitle: "Application approved or rejected", icon: <CheckCircle /> }
];

const TrackApplication = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center p-8 bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${BuildingSketch})` }}
    >
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-blue-900 text-center mb-6">
        Track Your Application
      </h2>

      {/* Progress Steps */}
      <div className="w-full max-w-4xl rounded-lg shadow-[0px_20px_50px_rgba(0,0,0,0.4)] p-6">
        <div className="flex justify-between items-center border-b pb-4">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold
                ${step.id <= currentStep ? "bg-blue-900" : "bg-gray-300"}`}
              >
                {step.id}
              </div>
              <p className={`text-sm mt-2 ${step.id <= currentStep ? "text-blue-900 font-semibold" : "text-gray-500"}`}>
                {step.title}
              </p>
            </div>
          ))}
        </div>

        {/* Step Details */}
        <div className="mt-6">
          {steps.map((step) => (
            <div key={step.id} className={`relative flex items-start mb-6 ${step.id <= currentStep ? "text-blue-900" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 
                ${step.id <= currentStep ? "border-blue-900 bg-blue-900 text-white" : "border-gray-300 bg-white"}`}
              >
                {step.icon}
              </div>
              <div className="ml-4">
                <h3 className={`text-lg font-semibold ${step.id <= currentStep ? "text-blue-900" : "text-gray-500"}`}>
                  {step.subtitle}
                </h3>
                <p className="text-sm">
                  {step.id === 1 && "Your proposal has been successfully submitted and is now under review."}
                  {step.id === 2 && "The ethics review board is assessing your submission to ensure it meets guidelines."}
                  {step.id === 3 && "You will be notified if revisions are required for approval."}
                  {step.id === 4 && "Your application has been approved or rejected."}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-6">
          <button className="bg-gradient-to-r from-blue-950 to-blue-800 text-white px-6 py-2 rounded-lg shadow-lg 
                     transition-transform duration-300 transform hover:scale-105 hover:from-blue-800 hover:to-blue-950">
            See Your Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackApplication;
