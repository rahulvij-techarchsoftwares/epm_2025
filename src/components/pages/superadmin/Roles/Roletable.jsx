import React, { useEffect, useState } from "react";
import { useRole } from "../../../context/RoleContext";
import { Edit, Save, Trash2, Loader2 } from "lucide-react";

export const Roletable = () => {
  const { roles, fetchRoles, deleteRole, updateRole, isLoading } = useRole();
  const [editRoleId, setEditRoleId] = useState(null); // Stores the ID of the role being edited
  const [editRoleName, setEditRoleName] = useState(""); // Stores the new role name
  const [deleteConfirm, setDeleteConfirm] = useState(null); // For delete confirmation
  const [isUpdating, setIsUpdating] = useState(false); // Loading state for updates

  useEffect(() => {
    fetchRoles(); // Fetch roles when the component mounts
  }, []);

  const handleEditClick = (role) => {
    setEditRoleId(role.id);
    setEditRoleName(role.name);
  };

  const handleSaveClick = async () => {
    if (!editRoleName.trim()) return;
    
    setIsUpdating(true);
    await updateRole(editRoleId, editRoleName);
    setIsUpdating(false);
    setEditRoleId(null); // Exit edit mode
  };

  const handleDeleteClick = (roleId) => {
    if (deleteConfirm === roleId) {
      deleteRole(roleId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(roleId);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="p-6 pb-3">
        <h2 className="text-xl font-semibold text-gray-800">Role Management</h2>
        <p className="text-sm text-gray-500 mt-1">View, edit and manage user roles</p>
      </div>
      
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">
                  Created Date
                </th>
                <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">
                  Updated Date
                </th>
                <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">
                  Role Name
                </th>
                <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
                      <span className="text-gray-500">Loading roles...</span>
                    </div>
                  </td>
                </tr>
              ) : roles.length > 0 ? (
                roles.map((role) => (
                  <tr 
                    key={role.id} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                        {formatDate(role.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {formatDate(role.updated_at)}
                    </td>
                    <td className="px-6 py-4 text-gray-800 font-medium text-sm">
                      {editRoleId === role.id ? (
                        <input
                          type="text"
                          value={editRoleName}
                          onChange={(e) => setEditRoleName(e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full max-w-xs"
                          placeholder="Enter role name"
                          autoFocus
                        />
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                          {role.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {editRoleId === role.id ? (
                          <button
                            onClick={handleSaveClick}
                            disabled={isUpdating}
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isUpdating ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <Save className="h-4 w-4 mr-1" />
                            )}
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditClick(role)}
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors duration-150"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteClick(role.id)}
                          className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md transition-colors duration-150 ${
                            deleteConfirm === role.id
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "border border-red-500 text-red-500 hover:bg-red-50"
                          }`}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {deleteConfirm === role.id ? "Confirm" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="rounded-full bg-gray-100 p-3">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No roles found</h3>
                      <p className="mt-1 text-sm text-gray-500">No roles have been created yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};