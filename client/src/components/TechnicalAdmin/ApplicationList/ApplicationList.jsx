import { useNavigate } from "react-router-dom";
import eye from "../../../assets/TechnicalAdmin/Eye.png";
import { useTheme } from "../../../context/theme/ThemeContext";

const ApplicationsTable = ({ data }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const getStatusStyles = (status) => {
    switch (status) {
      case "Pending":
        return isDarkMode 
          ? "bg-gray-600 text-gray-200 px-4 py-1 rounded-md text-sm"
          : "bg-gray-300 text-gray-800 px-4 py-1 rounded-md text-sm";
      case "Forwarded":
        return isDarkMode 
          ? "bg-green-800 text-green-200 px-4 py-1 rounded-md text-sm"
          : "bg-green-100 text-green-600 px-4 py-1 rounded-md text-sm";
      case "Returned":
        return isDarkMode 
          ? "bg-red-800 text-red-200 px-4 py-1 rounded-md text-sm"
          : "bg-red-100 text-red-600 px-4 py-1 rounded-md text-sm";
      default:
        return "";
    }
  };

  const handleViewClick = (id, status) => {
    if (status === "Pending") {
      navigate(`/Technical-Admin/${id}`);
    } else {
      navigate(`/Technical-Admin/Eval/${id}`);
    }
  };

  return (
    <div className={`min-h-screen flex justify-center w-full px-2 py-2 ${
      isDarkMode ? "bg-gray-900" : "bg-[#D9D9D9]"
    }`}>
      <div className={`w-full overflow-hidden rounded-lg shadow-lg py-4 ${
        isDarkMode ? "bg-gray-800" : "bg-[#D9D9D9]"
      }`}>
        <div className={`grid grid-cols-6 font-semibold p-5 rounded-2xl mb-3 ${
          isDarkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-700"
        }`}>
          <div className="flex justify-center items-center">User ID</div>
          <div className="flex justify-center items-center">User Name</div>
          <div className="flex justify-center items-center">Date / Time</div>
          <div className="flex justify-center items-center">Category</div>
          <div className="flex justify-center items-center">Status</div>
          <div className="flex justify-center items-center">View Details</div>
        </div>

        {data.map((row, index) => (
          <div
            key={index}
            className={`grid grid-cols-6 border-t p-6 items-center ${
              isDarkMode 
                ? `border-gray-600 ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}`
                : `border-gray-300 ${index % 2 === 0 ? "bg-white" : "bg-[#D9D9D9]"}`
            }`}
          >
            <div className={`flex justify-center items-center ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}>
              {row.id}
            </div>
            <div className={`flex justify-center items-center ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}>
              {row.name}
            </div>
            <div className={`flex justify-center items-center ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}>
              {row.date}
            </div>
            <div className={`flex justify-center items-center ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}>
              {row.category}
            </div>
            <div className="flex justify-center items-center">
              <span
                className={`font-medium ${getStatusStyles(
                  row.status
                )} flex justify-center items-center`}
              >
                {row.status}
              </span>
            </div>
            <div className="flex justify-center items-center">
              <img
                src={eye}
                className="w-6 h-6 cursor-pointer"
                alt="View"
                onClick={() => handleViewClick(row.id, row.status)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsTable;
