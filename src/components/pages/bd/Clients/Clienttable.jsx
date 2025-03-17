import React, { useEffect, useState } from "react";
import { useClient } from "../../../context/ClientContext";
import { Edit, Save, Trash2, Loader2 } from "lucide-react";

export const Clienttable = () => {
  const { clients, fetchClients, isLoading, editClient, deleteClient } = useClient();
  const [editClientId, setEditClientId] = useState(null);
  const [editClientName, setEditClientName] = useState("");
  const [editUpworkId, setEditUpworkId] = useState("");
  const [editContactDetail, setEditContactDetail] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);
  console.log(clients);

  const handleEditClick = (client) => {
    setEditClientId(client.id);
    setEditClientName(client.name);
    setEditUpworkId(client.upwork_id);
    setEditContactDetail(client.contact_detail);
  };

  const handleSaveClick = async () => {
    if (!editClientName.trim() || !editUpworkId.trim() || !editContactDetail.trim()) return;
    setIsUpdating(true);

    await editClient(editClientId, editClientName, editUpworkId, editContactDetail);

    setIsUpdating(false);
    setEditClientId(null);
  };

  const handleDeleteClick = async (clientId) => {
    if (deleteConfirm === clientId) {
      await deleteClient(clientId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(clientId);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="p-6 pb-3">
        <h2 className="text-xl font-semibold text-gray-800">Clients Management</h2>
        <p className="text-sm text-gray-500 mt-1">View, edit and manage Clients</p>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Client Name</th>
                <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Upwork ID</th>
                <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Contact Details</th>
                <th className="px-6 py-4 font-medium text-gray-600 text-start text-sm">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
                      <span className="text-gray-500">Loading clients...</span>
                    </div>
                  </td>
                </tr>
              ) : clients?.data?.length > 0 ? (
                clients.data.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-gray-800 font-medium text-sm">
                      {editClientId === client.id ? (
                        <input
                          type="text"
                          value={editClientName}
                          onChange={(e) => setEditClientName(e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full"
                          autoFocus
                        />
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                          {client.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {editClientId === client.id ? (
                        <input
                          type="text"
                          value={editUpworkId}
                          onChange={(e) => setEditUpworkId(e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full"
                        />
                      ) : (
                        client.upwork_id
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {editClientId === client.id ? (
                        <input
                          type="text"
                          value={editContactDetail}
                          onChange={(e) => setEditContactDetail(e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full"
                        />
                      ) : (
                        client.contact_detail
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {editClientId === client.id ? (
                          <button
                            onClick={handleSaveClick}
                            disabled={isUpdating}
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md transition disabled:opacity-50"
                          >
                            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditClick(client)}
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteClick(client.id)}
                          className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md transition ${
                            deleteConfirm === client.id
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "border border-red-500 text-red-500 hover:bg-red-50"
                          }`}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {deleteConfirm === client.id ? "Confirm" : "Delete"}
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
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
                      <p className="mt-1 text-sm text-gray-500">No clients have been added yet.</p>
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
