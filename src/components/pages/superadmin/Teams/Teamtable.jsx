import React, { useEffect, useState } from "react";
import { useTeam } from "../../../context/TeamContext";
import { Loader2 } from "lucide-react";

export const Teamtable = () => {
  const { teams, fetchTeams, deleteTeam, updateTeam, isLoading } = useTeam();
  const [editingTeam, setEditingTeam] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleEdit = (team) => {
    setEditingTeam(team.id);
    setNewName(team.name);
  };

  const handleUpdate = async (teamId) => {
    await updateTeam(teamId, newName);
    setEditingTeam(null);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm p-6 mb-3.5">
      <h2 className="text-xl font-semibold text-gray-800">Team Management</h2>
      <p className="text-sm text-gray-500 mt-1">Manage teams and update details</p>
      
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="border-b border-gray-200 bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">Created Date</th>
              <th className="px-4 py-2 text-left text-gray-600">Updated Date</th>
              <th className="px-4 py-2 text-left text-gray-600">Team Name</th>
              <th className="px-4 py-2 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="px-4 py-3 text-center text-gray-500">
                  <Loader2 className="h-5 w-5 animate-spin inline-block" /> Loading teams...
                </td>
              </tr>
            ) : teams.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-3 text-center text-gray-500">No teams found</td>
              </tr>
            ) : (
              teams.map((team) => (
                <tr key={team.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{team.created_at || "-"}</td>
                  <td className="px-4 py-3 text-gray-700">{team.updated_at || "-"}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {editingTeam === team.id ? (
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="border border-gray-300 p-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    ) : (
                      team.name
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingTeam === team.id ? (
                      <button
                        onClick={() => handleUpdate(team.id)}
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md mr-2 transition"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(team)}
                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md mr-2 transition"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => deleteTeam(team.id)}
                      className="px-3 py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
