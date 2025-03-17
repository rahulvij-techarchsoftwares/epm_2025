import React, { useState, useEffect } from 'react';
import { useLeave } from '../../../context/LeaveContext';
import { Calendar, Clock, FileText, Type, CheckCircle, XCircle, Clock3 } from 'lucide-react';
function LeaveForm() {
  const [leaveType, setLeaveType] = useState('');
  const [showHours, setShowHours] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    leave_type: '',
    hours: '',
    reason: '',
    status: 'Pending',
  });

  const { addLeave } = useLeave();

  useEffect(() => {
    if (leaveType === 'Short Leave') {
      setShowHours(true);
      setShowEndDate(false);
    } else if (leaveType === 'Multiple Days Leave') {
      setShowHours(false);
      setShowEndDate(true);
    } else {
      setShowHours(false);
      setShowEndDate(false);
    }
  }, [leaveType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('User not authenticated');
      return;
    }
  
    const leaveData = {
      start_date: formData.start_date,
      leave_type: leaveType, 
      reason: formData.reason,
    };
  
    if (leaveType === 'Multiple Days Leave') {
      leaveData.end_date = formData.end_date;
    }
  
    if (leaveType === 'Short Leave') {
      leaveData.hours = formData.hours;
    }
  
    console.log('Submitting Leave Data:', leaveData);
  
    try {
      const response = await addLeave(leaveData, token);
      console.log('API Response:', response);
  
      if (response) {
        alert('Leave request submitted successfully');
        setFormData({  
          start_date: '',
          end_date: '',
          leave_type: '',
          hours: '',
          reason: '',
        });
        setLeaveType('');
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('Failed to submit leave request.');
    }
  };




   // Static data for demonstration
   const leaves = [
    {
      leave_id: 1,
      start_date: '2024-03-15',
      end_date: '2024-03-16',
      leave_type: 'Full Leave',
      status: 'Approved',
      reviewed_date: '2024-03-14',
      reviewed_by: 'John Smith'
    },
    {
      leave_id: 2,
      start_date: '2024-03-20',
      end_date: '2024-03-20',
      leave_type: 'Half Day',
      status: 'Pending',
      reviewed_date: null,
      reviewed_by: null
    },
    {
      leave_id: 3,
      start_date: '2024-03-25',
      end_date: '2024-03-25',
      leave_type: 'Short Leave',
      status: 'Rejected',
      reviewed_date: '2024-03-23',
      reviewed_by: 'Sarah Johnson'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock3 className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
    }
  };
  
  return (
    <>
      <div className="flex flex-col items-center py-10">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg w-full md:w-2/3 mx-auto">
        <div className="flex items-center justify-center mb-8">
        <Calendar className="w-8 h-8 text-blue-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">Leave Request</h1>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Start Date */}
        <div className="relative">
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            Start Date
          </label>
          <input  
            type="date"
            id="start-date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
          />
        </div>

        {/* End Date */}
        {showEndDate && (
          <div className="relative">
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
            />
          </div>
        )}

        {/* Leave Type */}
        <div className="relative">
          <label htmlFor="leave-type" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Type className="w-4 h-4 mr-2 text-gray-400" />
            Leave Type
          </label>
          <div className="relative">
            <select
              id="leave-type"
              name="leave_type"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out appearance-none bg-white"
            >
              <option value="">Select Leave Type</option>
              <option value="Half Day">Half day</option>
              <option value="Full Leave">Full day</option>
              <option value="Short Leave">Short Leave</option>
              <option value="Multiple Days Leave">More Than 1 day</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Hours */}
        {showHours && (
          <div className="relative">
            <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              Number of Hours
            </label>
            <input
              type="number"
              id="hours"
              name="hours"
              min="1"
              max="8"
              value={formData.hours}
              onChange={handleChange}
              className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
            />
          </div>
        )}

        {/* Leave Reason */}
        <div className="relative">
          <label htmlFor="leave-reason" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-gray-400" />
            Leave Reason
          </label>
          <textarea
            id="leave-reason"
            name="reason"
            rows="4"
            value={formData.reason}
            onChange={handleChange}
            className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out resize-none"
            placeholder="Please provide a reason for your leave request..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5"
        >
          Submit Leave Request
        </button>
      </form>

      
        </div>
      </div>

      {/* Table for Leave Records */}
      <div className="mt-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-auto rounded  shadow-lg">
        <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-blue-50 border-b border-blue-100">
            <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Start Date
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                End Date
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Leave Type
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
              Approve Date
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
              Approved By
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {leaves.map((leave) => (
            <tr 
              key={leave.leave_id} 
              className="hover:bg-blue-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {leave.start_date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {leave.end_date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {leave.leave_type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(leave.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {leave.reviewed_date || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {leave.reviewed_by || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button 
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                  onClick={() => console.log('View details for leave:', leave.leave_id)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      </div>
    </>
  );
}

export default LeaveForm;