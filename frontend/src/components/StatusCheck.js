import React, { useState } from 'react';
import axios from 'axios';

function StatusCheck() {
  const [requestId, setRequestId] = useState('');
  const [status, setStatus] = useState('');

  const handleRequestIdChange = (e) => {
    setRequestId(e.target.value);
  };

  const checkStatus = async () => {
    try {
      const response = await axios.get(`https://image-compressor-ty3v.onrender.com/api/status/${requestId}`);
      setStatus(response.data.status);
      console.log(response.data);
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  return (
    <div>
      <p className="mb-2 mt-10 text-3xl font-bold text-[#0466c8]">Check Status of File</p>
      <input
        type="text"
        placeholder="Enter Request ID"
        value={requestId}
        onChange={handleRequestIdChange}
        className="block w-full px-3 py-3 mb-4 text-lg font-medium text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={checkStatus}
        className="w-full py-2 px-4 bg-[#219ebc] hover:bg-blue-700 text-white font-semibold rounded-lg"
      >
        Check Status
      </button>
      {status && (
        <p className="mt-4 font-bold text-2xl font-mono text-white border-red-200 border-4 px-2 py-2 bg-black">Status: {status}</p>
      )}
    </div>
  );
}

export default StatusCheck;
