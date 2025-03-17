import React, { useState, useEffect } from "react";
import { useTeam } from "../../../context/TeamContext";
import { Loader2 } from "lucide-react";

export const Teams = () => {
  const { addTeam, fetchTeams, updateTeam, deleteTeam, teams, isLoading, message } = useTeam();
  const [teamName, setTeamName] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (teamName.trim()) {
      await addTeam(teamName);
      setTeamName("");
      setShowMessage(true);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm p-6 mb-3.5">
      <h2 className="text-xl font-semibold text-gray-800">Enter Team Details</h2>
      <p className="text-sm text-gray-500 mt-1">Add a new team to the system</p>
      
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
          <label htmlFor="team" className="block font-medium text-gray-700 text-sm">
            Team Name
          </label>
          <input
            id="team"
            placeholder="Enter new Team"
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium p-2 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Adding Team...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
};
