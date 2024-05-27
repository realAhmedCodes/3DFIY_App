import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // Ensure this import is correct
import { useNavigate } from "react-router-dom";

export const DesignerProfile = () => {
  const [designer, setDesigner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [designerId, setDesignerId] = useState(null);
  const [models, setModels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const sellerId = decodedToken.seller_id;
        setDesignerId(sellerId);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!designerId) return;
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/modelApi/models/${designerId}`
        );
        const modelsData = await response.json();
        setModels(modelsData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [designerId]);

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

  console.log(designer.profile_pic);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 flex items-center">
        <div className="mr-4">
          {designer.profile_pic && (
            <img
              src={`http://localhost:8000/uploads/${designer.profile_pic
                .split("\\")
                .pop()}`}
              alt={designer.name}
              className="w-16 h-16 rounded-full mr-4"
            />
          )}
        </div>

        <div className="flex-grow">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">{designer.name}</h2>
            <p className="text-gray-600">{designer.location}</p>
          </div>
          <p className="italic text-gray-700 mt-2">{designer.bio}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <h1 className="text-xl font-bold mb-2">Latest Models</h1>
        {models.map((model) => (
          <div
            key={model.model_id}
            className="border rounded-md p-2 cursor-pointer hover:bg-gray-200"
            onClick={() => navigate(`/model/${model.model_id}`)}
          >
            <p>{model.name}</p>
            <p>{model.price}</p>
           
            {console.log(model.image)}
            {model.image && (
              <img
                src={`http://localhost:8000/uploads/models/${model.image
                  .split("\\")
                  .pop()}`}
                alt={model.name}
                className="w-full h-auto"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
