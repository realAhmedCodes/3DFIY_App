import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Ensure this import is correct

export const DesignerProfile = () => {
  const [designer, setDesigner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [designerId, setDesignerId] = useState(null); 

  useEffect(() => {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;
        setDesignerId(userId);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);
  console.log(designerId);

  
  useEffect(() => {
    const fetchData = async () => {
      if (!designerId) return; 

      try {
        const response = await fetch(
          `http://localhost:8000/usersApi/designers/${designerId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch designer data");
        }
        const data = await response.json();
        setDesigner(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [designerId]); 

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
console.log(designer.profile_pic)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <div className="flex-grow">
            <div className="flex items-center mb-4">
              <div>
                <img
                  src={`http://localhost:8000/uploads/${designer.profile_pic
                    .split("\\")
                    .pop()}`}
                  alt={designer.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
              </div>
              ;
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold">{designer.name}</h2>
                <p className="text-gray-600">{designer.location}</p>
              </div>
            </div>
            <p className="italic text-gray-700">{designer.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};



