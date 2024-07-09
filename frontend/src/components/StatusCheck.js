import React, { useState } from "react";
import axios from "axios";

function StatusCheck() {
  const [requestId, setRequestId] = useState("");
  const [status, setStatus] = useState("");
  const [outputLink, setOutputLink] = useState("");
  const [inputLink, setInputLink] = useState("");
  const handleRequestIdChange = (e) => {
    setRequestId(e.target.value);
  };

  const checkStatus = async () => {
    try {
      const response = await axios.get(
        `http://16.170.255.226:5000/api/status/${requestId}`
      );
      setStatus(response.data.status);
      setInputLink(response.data.inputCsv);
      setOutputLink(response.data.outputCsv);
    } catch (error) {
      console.error("Error checking status:", error);
    }
  };

  const handleDownloadClick = () => {
    window.open(outputLink);
  };

  return (
    <div>
      <p className="mb-2 mt-10 text-3xl font-bold text-[#0466c8]">
        Check Status of File
      </p>
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
        <div>
          <p className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-2xl mt-3 px-5 py-2.5 text-center me-2 mb-2">
            Status: {status}
          </p>
          <button onClick={()=>{window.open(inputLink);}} className="mt-3 block text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-48">Download Input File</button>
          <button onClick={()=>{window.open(outputLink);}} className="mt-3 block text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-48">Download Output File</button>
        </div>
      )}
    </div>
  );
}

export default StatusCheck;
