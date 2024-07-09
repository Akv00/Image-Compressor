import React, { useState } from "react";
import axios from "axios";

function UploadForm() {
  const [file, setFile] = useState(null);
  const [requestId, setRequestId] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://16.170.255.226:5000/api/uploadfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setRequestId(response.data.id);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  const handleCopyClick = () => {
    navigator.clipboard.writeText(requestId).then(() => {
      alert('Request ID copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="mb-8">
      <p className="mb-2 mt-10 text-3xl font-bold text-[#191cbb]">Upload File</p>
      <div
        className={`mt-2 flex justify-between border-2 rounded-xl px-5 py-3  text-[#9ba6bb] text-right font-medium text-lg bg-white`}
      >
        <input
          type="file"
          accept="text/csv" 
          onChange={handleFileChange}
          className="px-4 py-4 relative bg-[#e8ecf4] border-2 text-[#2d3035] rounded-md"
        />
      </div>
      <button
        onClick={handleUpload}
        className="mt-4 w-full py-2 px-4 bg-[#219ebc] hover:bg-blue-700 text-white font-semibold rounded-lg"
      >
        Upload
      </button>
      {requestId && (
        <div className="relative">
        <p className="text-white mt-5 text-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg px-5 py-2.5 text-center me-2 mb-2">
          Request ID: {requestId}
        </p>
        <button
          onClick={handleCopyClick}
          className="absolute right-5 top-1/2 transform -translate-y-1/2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded"
        >
          Copy
        </button>
      </div>
      )}
    </div>
  );
}

export default UploadForm;
