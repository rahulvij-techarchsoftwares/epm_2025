import React, { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useBDProjectsAssigned } from "../../../context/BDProjectsassigned";
import { usePMContext } from "../../../context/PMContext"; // Import PM context

export const PMassign = () => {
  const { projectManagers, isLoading, assignProject, message } = useBDProjectsAssigned();
  const { assignProjectToEmployees, isAssigning, assignedProjects, employees, isLoading: isProjectsLoading } = usePMContext(); // Get projects from PM context
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
  const handleSelectionChange = (employeeId) => {
    setSelectedManagers((prevSelected) =>
        prevSelected.includes(employeeId)
            ? prevSelected.filter((id) => id !== employeeId) 
            : [...prevSelected, employeeId]
    );
};



useEffect(() => {
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedProject || selectedManagers.length === 0) {
      setShowMessage(true);
      return;
  }

  console.log("Submitting Assignment:", {
      project_id: selectedProject,
      employee_ids: selectedManagers
  });

  await assignProjectToEmployees(selectedProject, selectedManagers);
  setSelectedProject("");
  setSelectedManagers([]);
  setShowMessage(true);
};


  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm p-6 mb-3.5">
      <h2 className="text-xl font-semibold text-gray-800">Assign Projects</h2>
      <p className="text-sm text-gray-500 mt-1">Add a new Project to the Team Members</p>

      {showMessage && (
        <div className="mt-4 p-3 rounded-md text-sm font-medium text-center bg-green-50 text-green-800 border border-green-300">
          Project assigned successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block font-medium text-gray-700 text-sm">Project Name</label>
          <select
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">Select Project</option>
            {isLoading ? (
              <option>Loading...</option>
            ) : (
              assignedProjects.map((project) => (
                <option key={project.id} value={project.id}>{project.project_name}</option>
              ))
            )}
          </select>
        </div>

        <div className="relative w-full" ref={dropdownRef}>
          <label className="block font-medium text-gray-700 text-sm">Employee Name</label>
          <button
            type="button"
            className="w-full text-left p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedManagers.length > 0
              ? selectedManagers.map(id => employees.find(emp => emp.id === id)?.name).join(", ")
              : "Select Employees"}
          </button>

          {isDropdownOpen && (
            <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto z-10">
              {isLoading ? (
                <p className="p-2 text-gray-500">Loading...</p>
              ) : (
                employees.map((employee) => (
                  <div
                    key={employee.id}
                    className={`cursor-pointer p-2 hover:bg-blue-100 flex items-center ${
                      selectedManagers.includes(employee.id) ? "bg-blue-200" : ""
                    }`}
                    onClick={() => handleSelectionChange(employee.id)}
                  >
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedManagers.includes(employee.id)}
                      readOnly
                    />
                    {employee.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium p-2 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
