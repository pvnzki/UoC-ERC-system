import React, { useState } from "react";
import BuildingSketch from "../../assets/Applicant/Building-Sketch.png";

const SignUp = () => {
  const [section, setSection] = useState("");

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 relative overflow-hidden"
      style={{ backgroundImage: `url(${BuildingSketch})` }}
    >
      <div className="relative z-10 bg-white shadow-2xl rounded-3xl w-2/3 max-w-4xl p-8">
        <h2 className="text-center text-3xl font-bold text-indigo-900 mb-6">
          Create an Account
        </h2>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                placeholder="Enter your first name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                placeholder="Enter your last name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Contact Number</label>
              <input
                type="text"
                placeholder="Enter your contact number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                placeholder="Enter your address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Select Your Section</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="academic_staff">Permanent academic staff or retired academic staff of University of Colombo</option>
              <option value="extended_faculty">Member of extended faculty of Faculty of Medicine, University of Colombo</option>
              <option value="students">Undergraduate or postgraduate student at University of Colombo</option>
              <option value="pgim_trainers">Trainer or trainee of PGIM, University of Colombo</option>
              <option value="researcher_mou">Researcher conducting a project under an MOU with UCFM</option>
              <option value="researcher_health">Researcher conducting a project on behalf of the Ministry of Health</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-900 text-white py-3 rounded-lg font-semibold hover:bg-indigo-800 transition duration-300"
          >
            Sign Up
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Sign in
            </a>
          </p>
        </form>
      </div>

      {/* Circle Animation - Behind Main Box */}
      <div className="absolute w-96 h-96 bg-indigo-500 opacity-20 rounded-full -top-10 left-10 animate-pulse z-0"></div>
      <div className="absolute w-72 h-72 bg-blue-400 opacity-20 rounded-full -bottom-10 right-20 animate-pulse z-0"></div>
    </div>
  );
};

export default SignUp;