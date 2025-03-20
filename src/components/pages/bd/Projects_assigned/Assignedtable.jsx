import React, { useEffect, useState } from "react";
import { useBDProjectsAssigned } from "../../../context/BDProjectsassigned";
import { Edit, Save, Trash2, Loader2, Calendar, Users, Building2, Clock } from "lucide-react";

function ProjectCard({ project, editProjectId, editProjectName, setEditProjectName, handleEditClick }) {

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {editProjectId === project.id ? (
              <input
                type="text"
                value={editProjectName}
                onChange={(e) => setEditProjectName(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full text-sm"
                autoFocus
              />
            ) : (
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white shadow-sm inline-block">
                  {project.project_name}
                </span>
                <div className="flex items-center text-gray-700">
                  <Building2 className="h-4 w-4 mr-2 text-blue-600" />
                  <h3 className="text-sm font-medium">{project.client?.name || "N/A"}</h3>
                </div>
              </div>
            )}
          </div>
          {/* <button
            onClick={() => handleEditClick(project)}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors duration-200"
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </button> */}
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
        <Users className="h-4 w-4 text-blue-600 mr-3" />
  <div>
    <span className="font-medium text-gray-700 block mb-1">Project Managers</span>
    {Array.isArray(project.project_managers) && project.project_managers.length > 0 ? (
      project.project_managers.map((pm) => (
        <div key={pm.id} className="text-gray-700">{pm.name}</div>
      ))
    ) : (
      "N/A"
    )}
  </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm font-medium text-gray-700">
            <Users className="h-4 w-4 text-blue-600 mr-2" />
            <span>Assigned Users</span>
          </div>
          {Array.isArray(project.assigned_users) && project.assigned_users.length > 0 ? (
            <div className="grid gap-2">
              {project.assigned_users.map((user) => (
                <div key={user.id} className="flex items-center text-sm bg-gray-50 rounded-lg p-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium mr-3">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">{user.name}</div>
                    <div className="text-gray-500 text-xs">{user.email}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">No assigned users</div>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <Clock className="h-4 w-4 text-blue-600 mr-3" />
          <div>
            <span className="font-medium text-gray-700 block mb-1">Deadline</span>
            {project.deadline || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
}

export const Assignedtable = () => {
  const { assignedData, fetchAssigned, isLoading } = useBDProjectsAssigned();
  const [editProjectId, setEditProjectId] = useState(null);
  const [editProjectName, setEditProjectName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  console.log("this is assigned data", assignedData);
    useEffect(() => {
    fetchAssigned();
  }, []);

  const handleEditClick = (project) => {
    setEditProjectId(project.id);
    setEditProjectName(project.project_name);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Assigned Projects</h2>
        <p className="text-gray-600">View, edit, and manage your team's assigned projects</p>
      </div>

      <div className="p-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="bg-white rounded-lg shadow-md px-6 py-4 flex items-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-3" />
              <span className="text-gray-600 font-medium">Loading assigned projects...</span>
            </div>
          </div>
        ) : assignedData?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assignedData.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                editProjectId={editProjectId}
                editProjectName={editProjectName}
                setEditProjectName={setEditProjectName}
                handleEditClick={handleEditClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-gray-100 p-4 mb-4">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No assigned projects found</h3>
            <p className="text-gray-500 text-center max-w-md">
              There are currently no projects assigned. New projects will appear here once they're assigned to the team.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignedtable;