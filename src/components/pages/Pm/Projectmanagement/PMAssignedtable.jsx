import React, { useEffect } from "react";
import { usePMContext } from "../../../context/PMContext";
import { Loader2 } from "lucide-react";

export const PMAssignedtable = () => {
  const { assignedProjects, isLoading, fetchAssignedProjects } = usePMContext();

  useEffect(() => {
    fetchAssignedProjects();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="p-6 pb-3">
        <h2 className="text-xl font-semibold text-gray-800">Projects Assigned</h2>
        <p className="text-sm text-gray-500 mt-1">View assigned projects</p>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Project Name</th>
              <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Client Name</th>
              <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Requirements</th>
              <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Budget</th>
              <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Deadline</th>
              <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Assigned Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
                    <span className="text-gray-500">Loading projects...</span>
                  </div>
                </td>
              </tr>
            ) : assignedProjects?.length > 0 ? (
              assignedProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 text-gray-800 font-medium text-sm">{project.project_name || "N/A"}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{project.client?.name || "N/A"}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{project.requirements || "N/A"}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">${project.budget || "0.00"}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{project.deadline || "N/A"}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {project.assigned_by?.updated_at 
                      ? new Date(project.assigned_by.updated_at).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short", 
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true, 
                        })
                      : "N/A"}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center">
                  <p className="text-gray-500">No assigned projects found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
