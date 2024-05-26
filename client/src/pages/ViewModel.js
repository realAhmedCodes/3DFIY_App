import React, { useState, useEffect } from "react";

export const ViewModel = () => {
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/modelApi/models");
        const modelsData = await response.json();
        setModels(modelsData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <h1 className="text-xl font-bold mb-2">Latest Models</h1>
        {models.map((model) => (
          <div
            key={model.model_id}
            className="border rounded-md p-2 cursor-pointer hover:bg-gray-200"
          >
            <p>{model.name}</p>
            <p>{model.price}</p>

           
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
