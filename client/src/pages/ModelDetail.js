import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

export const ModelDetail = () => {
  const { modelId } = useParams();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkToken, setCheckToken] = useState("");
  const [sellerType, setSellerType] = useState("");
  const [isLiked, setIsLiked] = useState(null);
   const [isSaved, setIsSaved] = useState(null);
  const [userId, setUserId] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      setCheckToken(token);
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.user_id);
        setSellerType(decodedToken.sellerType);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);
  console.log("sw", userId);

  useEffect(() => {
    const fetchModelDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/modelApi/modelDetail/${modelId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch model details");
        }
        const data = await response.json();
        setModel(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchModelDetail();
  }, [modelId]);
/*
  useEffect(() => {
    const fetchModelLike = async () => {
      if (userId !== null) {
        // Check if userId is not null
        try {
          const response = await fetch(
            `http://localhost:8000/likeApi/likeCheck/${modelId}/${userId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch like details");
          }
          const data = await response.json();
          setIsLiked(data.liked);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchModelLike();
  }, [modelId, userId]); // Include userId as a dependency
*/
  const updateModelBtn = () => {
    nav(`/updateModel/${modelId}`, { state: { model } });
  };

  const delModelBtn = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this model?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:8000/modelApi/deleteModel/${modelId}`
        );
        console.log("Model deleted successfully!");
        nav("/some-path"); // Adjust the path as necessary
      } catch (err) {
        console.log(err);
      }
    }
  };

  const likeBtn = async () => {
    try {
      if (isLiked) {
        await axios.post(
          `http://localhost:8000/likeApi/unlike/${modelId}/${userId}`
        );
      } else {
        await axios.post(
          `http://localhost:8000/likeApi/like/${modelId}/${userId}`
        );
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Failed to update like status", err);
    }
  };


  const saveBtn=async()=>{
try {
  if (isSaved) {
    await axios.post(
      `http://localhost:8000/saveModelsApi/unsave/${modelId}/${userId}`
    );
  } else {
    await axios.post(`http://localhost:8000/saveModelsApi/save/${modelId}/${userId}`);
  }
  setIsSaved(!isSaved);
} catch (err) {
  console.error("Failed to update save models status", err);
}
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!model) {
    return <div>No model found</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{model.user_name}</h1>
            <div className="flex items-center">
              {model.profile_pic && (
                <img
                  src={`http://localhost:8000/uploads/${model.profile_pic
                    .split("\\")
                    .pop()}`}
                  alt={model.user_name}
                  className="w-12 h-12 rounded-full mr-4"
                />
              )}
              <h2 className="text-lg">{model.user_location}</h2>
            </div>
            <h1>{model.tags}</h1>
          </div>
          <h1 className="text-2xl font-bold mb-4">{model.model_name}</h1>
          <p className="text-gray-700 mb-4">{model.description}</p>
          <div className="mb-4">
            {model.image && (
              <img
                src={`http://localhost:8000/uploads/models/${model.image
                  .split("\\")
                  .pop()}`}
                alt={model.name}
                className="w-40 h-auto rounded-lg"
              />
            )}
          </div>
          <div className="flex items-center justify-between">
            {model.isFree === false && (
              <>
                <h3 className="text-xl font-bold">{model.price}</h3>
              </>
            )}

            <div>
              <>
                <button onClick={saveBtn}>
                  {isSaved ? "Unsave Model" : "Save Model"}
                </button>
              </>
            </div>
            <div>
              {sellerType === "Designer" && (
                <>
                  <button onClick={updateModelBtn}>Update Model</button>
                  <button onClick={delModelBtn}>Delete Model</button>
                </>
              )}
            </div>
            <div>
              <button onClick={likeBtn}>
                {isLiked ? "Remove Like" : "Like"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
