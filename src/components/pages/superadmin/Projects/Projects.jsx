import React, { useState } from "react";
import { useProject } from "../../../context/ProjectContext";
import { useClient } from "../../../context/ClientContext";
import { Loader2 } from "lucide-react";

export const Projects = () => {
  const { addProject, isLoading, message } = useProject();
  const [clientId, setClientId] = useState("");
  const { clients } = useClient();
  const [projectName, setProjectName] = useState("");
  const [requirements, setRequirements] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [totalHours, setTotalHours] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      clientId.trim() &&
      projectName.trim() &&
      requirements.trim() &&
      budget.trim() &&
      deadline.trim() &&
      totalHours.trim()
    ) {
      await addProject(clientId, projectName, requirements, budget, deadline, totalHours);
      setClientId("");
      setProjectName("");
      setRequirements("");
      setBudget("");
      setDeadline("");
      setTotalHours("");
      setShowMessage(true);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm p-6 mb-3.5">
      <h2 className="text-xl font-semibold text-gray-800">Enter Project Details</h2>
      <p className="text-sm text-gray-500 mt-1">Add a new Project to the system</p>

      {showMessage && message && (
        <div
          className={`mt-4 p-3 rounded-md text-sm font-medium text-center ${
            message.includes("successfully")
              ? "bg-green-50 text-green-800 border border-green-300"
              : "bg-red-50 text-red-800 border border-red-300"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="clientName" className="block font-medium text-gray-700 text-sm">
            Client Name
          </label>
          <select
            id="clientName"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select Client</option>
            {clients?.data?.map((client) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>

        </div>

        <div>
          <label htmlFor="projectName" className="block font-medium text-gray-700 text-sm">
            Project Name
          </label>
          <input
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter Project Name"
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="requirements" className="block font-medium text-gray-700 text-sm">
            Requirements
          </label>
          <input
            id="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Enter Requirements"
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="budget" className="block font-medium text-gray-700 text-sm">
            Budget
          </label>
          <input
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Enter Budget"
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="totalHours" className="block font-medium text-gray-700 text-sm">
            Total Hours
          </label>
          <input
            id="totalHours"
            type="number"
            value={totalHours}
            onChange={(e) => setTotalHours(e.target.value)}
            placeholder="Enter Total Hours"
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="deadline" className="block font-medium text-gray-700 text-sm">
            Deadline
          </label>
          <input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium p-2 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Adding Project...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>  
  );
};
