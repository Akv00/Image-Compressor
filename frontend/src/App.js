import React from 'react';
import UploadForm from './components/UploadForm';
import StatusCheck from './components/StatusCheck';

function App() {
  return (
    <div className="min-h-screen bg-custom-gradient p-6">
      <div className="max-w-4xl mx-auto bg-[#bde0fe] shadow-lg rounded-lg p-8">
        <h1 className="text-5xl font-bold text-center mb-6 text-[#2364aa]">Image Processing App</h1>
        <UploadForm />
        <StatusCheck />
      </div>
    </div>
  );
}

export default App;
