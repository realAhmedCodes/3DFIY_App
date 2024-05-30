import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const materials = {
  PLA: { name: "PLA", costPerCm: 0.05 },
  PETG: { name: "PETG", costPerCm: 0.07 },
  ABS: { name: "ABS", costPerCm: 0.06 },
  ASA: { name: "ASA", costPerCm: 0.08 },
  TPU: { name: "TPU", costPerCm: 0.1 },
  Nylon: { name: "Nylon", costPerCm: 0.09 },
};

const resistances = [0, 20, 40, 60, 80, 100];

const resolutions = {
  detailed: "0.10",
  medium: "0.20",
  draft: "0.30",
};

export const ModelCal = () => {
  const location = useLocation();
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [resolution, setResolution] = useState("");
  const [resistance, setResistance] = useState("");
  const [cost, setCost] = useState(null);
  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    const file = location.state?.file;
    setFileData(file);
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fileData) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileData);
    formData.append("material", material);
    formData.append("color", color);
    formData.append("resolution", resolution);
    formData.append("resistance", resistance);

    try {
      const response = await fetch("http://localhost:8001/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorDetail = await response.json();
        console.error("Error response from server:", errorDetail);
        return;
      }

      const data = await response.json();
      if (data.cost !== undefined) {
        setCost(data.cost);
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">3D Model Upload</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="material"
            className="block text-sm font-medium text-gray-700"
          >
            Material
          </label>
          <select
            id="material"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="mt-1 block w-full"
          >
            <option value="">Select Material</option>
            {Object.keys(materials).map((key) => (
              <option key={key} value={key}>
                {materials[key].name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="color"
            className="block text-sm font-medium text-gray-700"
          >
            Color
          </label>
          <select
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="mt-1 block w-full"
          >
            <option value="">Select Color</option>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
            {/* Add more colors as needed */}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="resolution"
            className="block text-sm font-medium text-gray-700"
          >
            Resolution
          </label>
          <select
            id="resolution"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="mt-1 block w-full"
          >
            <option value="">Select Resolution</option>
            {Object.keys(resolutions).map((key) => (
              <option key={key} value={resolutions[key]}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="resistance"
            className="block text-sm font-medium text-gray-700"
          >
            Resistance
          </label>
          <select
            id="resistance"
            value={resistance}
            onChange={(e) => setResistance(e.target.value)}
            className="mt-1 block w-full"
          >
            <option value="">Select Resistance</option>
            {resistances.map((res) => (
              <option key={res} value={res}>
                {res}%
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 rounded-md py-2 px-4 bg-[#539e60] text-sm font-medium text-white"
        >
          Calculate Cost
        </button>
      </form>
      {cost !== null && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">
            Estimated Cost: ${cost.toFixed(2)}
          </h3>
        </div>
      )}
    </div>
  );
};

/*
const handleSubmit = async (event) => {
  event.preventDefault();
  console.log(file, material, color, resistance, resolution);

 const formData = new FormData();
  formData.append("fileData", file); 
  formData.append("material", material);
  formData.append("color", color);
  formData.append("resolution", resolution);
  formData.append("resistance", resistance);

  try {
    const response = await fetch("http://localhost:8000/costApi/upload", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Response data:", data);
    setCost(data.cost);
  } catch (error) {
    console.error("Error uploading file:", error.message);
  }
};
*/
