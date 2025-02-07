import React from 'react';
import { FaUserFriends, FaCheckCircle } from 'react-icons/fa';
import { IoIosPaper, IoIosTime } from 'react-icons/io';
import BuildingSketch from '../../assets/Applicant/Building-Sketch.png';

const AboutProcess = () => {
  const steps = [
    { label: 'Applicants', icon: <FaUserFriends /> },
    { label: 'Submissions', icon: <IoIosPaper /> },
    { label: 'Pendings', icon: <IoIosTime /> },
    { label: 'Success Rate', icon: <FaCheckCircle /> },
  ];

  return (
    <div
      className="relative bg-cover bg-center py-16 px-6 md:px-20"
      style={{ backgroundImage: `url(${BuildingSketch})` }} // Background image applied here
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-opacity-90"></div>

      {/* About the Process Section */}
      <div className="relative z-10 max-w-4xl mx-auto mb-16"> {/* Added mb-16 for extra spacing */}
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4 text-left">
          About the Process
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed text-left">
          The Ethical Research Clearance system is designed to ensure that all research conducted 
          within our medical faculty adheres to the highest ethical standards. This system provides a 
          streamlined and transparent process for researchers to submit their proposals for review, 
          ensuring that research involving human participants, animals, or sensitive data is conducted 
          responsibly and ethically. Through this platform, faculty members and researchers can easily 
          submit their research protocols, track the progress of their applications, and receive approvals 
          or feedback from the ethics review board. Our goal is to foster research that prioritizes the safety, 
          privacy, and well-being of participants while maintaining scientific integrity and compliance with 
          regulatory standards.
        </p>
      </div>

      {/* Process Steps Section */}
      {/* Process Steps Section */}
<div className="flex justify-center items-center space-x-12 mt-8"> {/* Increased space-x-8 to space-x-12 */}
  {steps.map((step, index) => (
    <div
      key={index}
      className="bg-blue-900 text-white px-6 py-3 flex items-center font-semibold text-lg rounded-md relative shadow-lg"
    >
      {/* Step Content */}
      <span className="flex items-center gap-2">
        {step.icon}
        {step.label}
      </span>

      {/* Arrow Connector (Except for last step) */}
      {index !== steps.length - 1 && (
        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 bg-blue-900 rotate-45"></div> {/* Adjusted size */}
        </div>
      )}
    </div>
  ))}
</div>



      {/* Call to Action Section */}
      <div className="relative z-10 text-center h-20">
        <h3 className="text-4xl font-bold text-blue-900 items-center mt-20 cursor-pointer hover:text-blue-700 transition">
          Call To Action &gt;
        </h3>
      </div>
    </div>
  );
};

export default AboutProcess;
