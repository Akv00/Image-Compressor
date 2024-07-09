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
        <p className="mt-4 font-bold text-2xl font-mono text-white border-red-200 border-4 px-2 py-2 bg-black">Request ID: {requestId}</p>
      )}
    </div>
  );
}

export default UploadForm;
