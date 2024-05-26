import React, { useState, useEffect } from "react";

export const DesignerProfile = () => {
  const [designer, setDesigner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/usersApi/designers");
      if (!response.ok) {
        throw new Error("Failed to fetch designer data");
      }
      const data = await response.json();
      if (data.length === 0) {
        throw new Error("No designer data available");
      }
      setDesigner(data[0]);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

 const arrayBufferToBase64 = (buffer) => {
   const bytes = new Uint8Array(buffer);
   let binary = "";
   for (let i = 0; i < bytes.byteLength; i++) {
     binary += String.fromCharCode(bytes[i]);
   }
   return window.btoa(binary);
 };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  if (!designer) {
    return (
      <div className="flex justify-center items-center h-screen">
        No designer data available
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold flex items-center">
              {designer.name}
              <span className="ml-2 text-blue-500">✔</span>
            </h2>
            <p className="text-gray-600">{designer.location}</p>

            <div className="flex items-center my-2 text-gray-700">
              {designer.profile_pic && (
                <img
                  src={arrayBufferToBase64(designer.profile_pic.data)}
                  alt={designer.name}
                  className="w-32 h-32 rounded-full"
                />
              )}
            </div>
            <p className="italic">{designer.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
