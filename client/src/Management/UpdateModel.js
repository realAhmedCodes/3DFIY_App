import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { jwtDecode, InvalidTokenError } from "jwt-decode";

export const UpdateModel = () => {
  const { modelId } = useParams();
  const location = useLocation();
  const { model } = location.state || {};
  const [name, setName] = useState(model?.model_name || "");
  const [description, setDescription] = useState(model?.description || "");
  const [price, setPrice] = useState(model?.price || "");
  const [isFree, setIsFree] = useState(model?.isFree || false);
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState(model?.tags || []);
  const [tagsInput, setTagsInput] = useState("");
  const [modelFile, setModelFile] = useState(null);
  const [designer_id, setDesigner_Id] = useState(null);
  const [category_id, setCategory_Id] = useState(model?.category_id || null);
  const [checkToken, setCheckToken] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = window.sessionStorage.getItem("token");
    setCheckToken(token || "");
    try {
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;
        setDesigner_Id(userId);
      }
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category_id", category_id);
    formData.append("designer_id", designer_id);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("is_free", isFree);
    if (image) formData.append("image", image);
    if (modelFile) formData.append("modelFile", modelFile);

    try {
      const response = await fetch(
        `http://localhost:8000/modelApi/updateModel/${modelId}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.error) {
        console.log(data.error);
      } else {
        console.log("Model updated successfully:", data);
        navigate(`/model/${modelId}`); // Redirect to model detail page after update
      }
    } catch (error) {
      console.error(error);
      console.log("Server Error");
    }
  };

  return (
    <div className="main_div">
      <div className="form_div">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Enter Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description">Enter Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="is_free">Is It Paid?</label>
            <input
              type="radio"
              value={false}
              checked={!isFree}
              onChange={() => setIsFree(false)}
            />
            Paid
            <input
              type="radio"
              value={true}
              checked={isFree}
              onChange={() => setIsFree(true)}
            />
            Free
          </div>
          {!isFree && (
            <div>
              <label htmlFor="price">Enter Price</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          )}
          <div>
            <label htmlFor="tags">Enter Tags</label>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Enter skill..."
                  className="border border-gray-300 px-3 py-2 rounded-md w-64 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => {
                    if (tagsInput.trim() !== "") {
                      setTags([...tags, tagsInput.trim()]);
                      setTagsInput("");
                    }
                  }}
                >
                  Add Tag
                </button>
              </div>
              <div>
                {tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="image">Upload Image</label>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div>
            <label htmlFor="modelFile">Upload Model File</label>
            <input
              type="file"
              onChange={(e) => setModelFile(e.target.files[0])}
            />
          </div>
          <button type="submit">Update Model</button>
        </form>
      </div>
    </div>
  );
};

