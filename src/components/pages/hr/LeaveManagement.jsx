import React, { useEffect, useState } from "react";
import { Loader2, Calendar, User, Clock, FileText, BarChart, Search } from "lucide-react";

export const LeaveManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [leaveData, setLeaveData] = useState([
        { id: 1, date: "2025-03-15", employee_name: "John Doe", leave_type: "Sick Leave", duration: "Full Day", reason: "Fever", status: "pending" },
        { id: 2, date: "2025-03-18", employee_name: "Jane Smith", leave_type: "Casual Leave", duration: "Half Day", reason: "Personal work", status: "approved" },
        { id: 3, date: "2025-03-20", employee_name: "Mike Johnson", leave_type: "Annual Leave", duration: "Full Day", reason: "Vacation", status: "rejected" }
    ]);

    useEffect(() => {
        if (searchTerm) {
            const filtered = leaveData.filter(leave => leave.employee_name.toLowerCase().includes(searchTerm.toLowerCase()));
            setFilteredData(filtered);
        } else {
            setFilteredData([]);
        }
    }, [searchTerm, leaveData]);

    const handleStatusChange = (id, newStatus) => {
        setLeaveData(prevData => prevData.map(leave => leave.id === id ? { ...leave, status: newStatus } : leave));
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="p-8 bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500">
                <div className="flex items-center gap-3 mb-3">
                    <BarChart className="h-10 w-10 text-blue-100" />
                    <h2 className="text-3xl font-bold text-white">Manage Leaves</h2>
                </div>
                <p className="text-blue-100 text-lg">Track and manage leave requests</p>
            </div>

            <div className="p-4 flex items-center gap-3">
                <div className="relative w-full max-w-md">
                    <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="Search by Employee Name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
            </div>

            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[800px]">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 text-gray-600 text-sm border-b border-gray-200">
                                {[ 
                                    { label: "Date", icon: Calendar },
                                    { label: "Employee Name", icon: User },
                                    { label: "Leave Type" },
                                    { label: "Duration", icon: Clock },
                                    { label: "Reason", icon: FileText },
                                    { label: "Status" }
                                ].map(({ label, icon: Icon }, index) => (
                                    <th key={index} className="px-6 py-4 text-left font-semibold">
                                        <div className="flex items-center gap-2">
                                            {Icon && <Icon className="h-4 w-4 text-blue-600" />}
                                            {label}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(searchTerm ? filteredData : leaveData).map((leave, index) => (
                                <tr key={index} className="hover:bg-blue-50/50 transition-all duration-200 ease-in-out">
                                    <td className="px-6 py-4 text-gray-700">{leave.date}</td>
                                    <td className="px-6 py-4 text-gray-700">{leave.employee_name}</td>
                                    <td className="px-6 py-4 text-gray-700">{leave.leave_type}</td>
                                    <td className="px-6 py-4 text-gray-700">{leave.duration}</td>
                                    <td className="px-6 py-4 text-gray-700">{leave.reason}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            className={`px-3 py-2 border rounded-lg cursor-pointer ${
                                                leave.status === "approved" ? "bg-green-100 text-green-700" :
                                                leave.status === "rejected" ? "bg-red-100 text-red-700" :
                                                "bg-yellow-100 text-yellow-700"
                                            }`}
                                            value={leave.status}
                                            onChange={(e) => handleStatusChange(leave.id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
