import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode, InvalidTokenError } from "jwt-decode";
import { useNavigate } from "react-router-dom";
export const ModelDetail = () => {
  const { modelId } = useParams();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [checkToken, setCheckToken] = useState("");
const[sellerType, setSellerType]= useState("")


const nav=useNavigate()
console.log(sellerType)
   useEffect(() => {
     const token = window.sessionStorage.getItem("token");
     console.log(token);
     setCheckToken(token || "");
     try {
       if (token) {
         const decodedToken = jwtDecode(token);
        
         const sellerType = decodedToken.sellerType;
         
         setSellerType(sellerType);
       }
     } catch (error) {
       if (error instanceof InvalidTokenError) {
         console.error("Invalid token");
       }
     }
   }, []);

   

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!model) {
    return <div>No model found</div>;
  }
  const updateModelBtn=()=>{
     nav(`/updateModel/${modelId}`, { state: { model } });
  }
const delModelBtn=()=>{

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
            {model.isFree === false ? (
              <>
               
                <h3 className="text-xl font-bold">{model.price}</h3>
              </>
            ) : (
              ""
            )}

            <div>
              {sellerType !== "Designer" ? (
                <>
                  <button>Save 3D Model</button>
                </>
              ) : (
                ""
              )}
            </div>
            <div>
              {sellerType === "Designer" ? (
                <>
                 
                  <button onClick={updateModelBtn}>Update Model</button>
                  <button onClick={delModelBtn}>Delete Model</button>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


