import React from "react";
import ApplicationList from "../../components/TechnicalAdmin/ApplicationReview/ApplicationList.jsx";

const ApprovedApplications = () => {
  const data = [
    {
      id: "00004MS",
      name: "Name here",
      date: "2024/12/12 10.00",
      category: "Clinical",
      status: "Forwarded",
    },
    {
      id: "00005MS",
      name: "Name here",
      date: "2024/12/12 10.00",
      category: "Clinical",
      status: "Forwarded",
    },
  ];

  // Adapt data to match ApplicationReview's ApplicationList
  const applications = data.map((row) => ({
    application_id: row.id,
    applicant: {
      first_name: row.name.split(" ")[0] || "",
      last_name: row.name.split(" ")[1] || "",
    },
    submission_date: row.date,
    research_type: row.category,
    status: row.status,
  }));
  const handleViewApplication = (id) => {
    // Implement navigation or modal logic as needed
    console.log("View application", id);
  };
  return (
    <ApplicationList
      applications={applications}
      onViewApplication={handleViewApplication}
    />
  );
};

export default ApprovedApplications;
