import React, { useEffect, useState } from "react";
import { useProject } from "../../../context/ProjectContext";
import { useClient } from "../../../context/ClientContext"; 
import { Edit, Save, Trash2, Loader2 } from "lucide-react";

export const Projecttable = () => {
  const { projects, fetchProjects, editProject, deleteProject, isLoading } = useProject();
  const { clients } = useClient(); // Getting clients data
  const [editProjectId, setEditProjectId] = useState(null);
  const [editClientId, setEditClientId] = useState("");
  const [editProjectName, setEditProjectName] = useState("");
  const [editRequirements, setEditRequirements] = useState("");
  const [editBudget, setEditBudget] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEditClick = (project) => {
    setEditProjectId(project.id);
    setEditClientId(project.client.id);
    setEditProjectName(project.project_name);
    setEditRequirements(project.requirements || ""); 
    setEditBudget(project.budget || ""); 
    setEditDeadline(project.deadline || ""); 
  };

  const handleSaveClick = async () => {
    if (!editProjectName.trim()) return;

    const updatedData = {
      client_id: editClientId,
      project_name: editProjectName,
      requirements: editRequirements || null, 
      budget: editBudget ? parseFloat(editBudget) : null, 
      deadline: editDeadline || null,
    };

    setIsUpdating(true);
    await editProject(editProjectId, updatedData);
    setIsUpdating(false);
    setEditProjectId(null);
  };

  const handleDeleteClick = async (projectId) => {
    if (deleteConfirm === projectId) {
      await deleteProject(projectId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(projectId);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="p-6 pb-3">
        <h2 className="text-xl font-semibold text-gray-800">Projects Management</h2>
        <p className="text-sm text-gray-500 mt-1">View, edit and manage Projects</p>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Client Name</th>
                <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Project Name</th>
                <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Requirements</th>
                <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Budget</th>
                <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Deadline</th>
                <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Created Date</th>
                <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
                      <span className="text-gray-500">Loading projects...</span>
                    </div>
                  </td>
                </tr>
              ) : projects?.length > 0 ? (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-gray-800 font-medium text-sm">
                      {editProjectId === project.id ? (
                        <select
                          value={editClientId}
                          onChange={(e) => setEditClientId(e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full"
                        >
                          {clients?.data?.map((client) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
                        </select>
                      ) : (
                        project.client ? project.client.name : "No Client"
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-800 font-medium text-sm">
                      {editProjectId === project.id ? (
                        <input
                          type="text"
                          value={editProjectName}
                          onChange={(e) => setEditProjectName(e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full"
                          autoFocus
                        />
                      ) : (
                        project.project_name
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {editProjectId === project.id ? (
                        <input
                          type="text"
                          value={editRequirements}
                          onChange={(e) => setEditRequirements(e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full"
                        />
                      ) : (
                        project.requirements || "N/A"
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {editProjectId === project.id ? (
                        <input
                          type="number"
                          value={editBudget}
                          onChange={(e) => setEditBudget(e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full"
                        />
                      ) : (
                        project.budget || "N/A"
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {editProjectId === project.id ? (
                        <input
                          type="date"
                          value={editDeadline}
                          onChange={(e) => setEditDeadline(e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full"
                        />
                      ) : (
                        project.deadline || "N/A"
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {project.created_at}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {editProjectId === project.id ? (
                          <button onClick={handleSaveClick} disabled={isUpdating} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md transition disabled:opacity-50">
                            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />} Save
                          </button>
                        ) : (
                          <button onClick={() => handleEditClick(project)} className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition">
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </button>
                        )}
                        <button onClick={() => handleDeleteClick(project.id)} className={`px-3 py-1.5 rounded-md transition ${deleteConfirm === project.id ? "bg-red-500 hover:bg-red-600 text-white" : "border border-red-500 text-red-500 hover:bg-red-50"}`}>
                          <Trash2 className="h-4 w-4 mr-1" /> {deleteConfirm === project.id ? "Confirm" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">No Projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
