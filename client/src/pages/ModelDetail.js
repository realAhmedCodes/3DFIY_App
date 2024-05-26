import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const ModelDetail = () => {
  const { modelId } = useParams();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModelDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/modelApi/model/${modelId}`
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
    <div>
      <h1>{model.name}</h1>
      <p>{model.description}</p>
      {model.image && (
        <img
          src={`http://localhost:8000/uploads/models/${model.image}`}
          alt={model.name}
        />
      )}
    </div>
  );
};
