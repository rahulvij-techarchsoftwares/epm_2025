import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useBDProjectsAssigned } from "../../../context/BDProjectsassigned";

export const Assigned = () => {
  const { projects, projectManagers, isLoading, assignProject, message } = useBDProjectsAssigned();

  const [selectedProject, setSelectedProject] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProject || !selectedManager) {
      setShowMessage(true);
      return;
    }

    // Assign project to manager
    await assignProject(selectedProject, selectedManager);
    setSelectedProject("");
    setSelectedManager("");
    setShowMessage(true);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm p-6 mb-3.5">
      <h2 className="text-xl font-semibold text-gray-800">Assign Projects</h2>
      <p className="text-sm text-gray-500 mt-1">Add a new Project to the Project Manager</p>

      {showMessage && message && (
        <div className={`mt-4 p-3 rounded-md text-sm font-medium text-center 
          ${message.includes("successfully") ? "bg-green-50 text-green-800 border border-green-300" : "bg-red-50 text-red-800 border border-red-300"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Select Project */}
        <div>
          <label htmlFor="clientName" className="block font-medium text-gray-700 text-sm">Projects</label>
          <select
            id="clientName"
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">Select Project</option>
            {isLoading ? <option>Loading...</option> : projects.map((project) => (
              <option key={project.id} value={project.id}>{project.project_name}</option>
            ))}
          </select>
        </div>

        {/* Select Project Manager */}
        <div>
          <label htmlFor="projectManager" className="block font-medium text-gray-700 text-sm">Project Manager</label>
          <select
            id="projectManager"
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
          >
            <option value="">Select Project Manager</option>
            {isLoading ? <option>Loading...</option> : projectManagers.map((manager) => (
              <option key={manager.id} value={manager.id}>{manager.name}</option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium p-2 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
};
