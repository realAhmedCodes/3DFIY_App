import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { jwtDecode, InvalidTokenError } from "jwt-decode";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
   const [categories, setCategories] = useState([]);
   const [selectedCategory, setSelectedCategory] = useState("");
   const [customCategory, setCustomCategory] = useState("");
   const [subcategories, setSubCategories] = useState([]);
   const [selectedSubCategory, setSelectedSubCategory] = useState("");
   const [customSubCategory, setCustomSubCategory] = useState("");
   const [subSubcategories, setSubSubCategories] = useState([]);
   const [selectedSubSubCategory, setSelectedSubSubCategory] = useState("");
   const [customSubSubCategory, setCustomSubSubCategory] = useState("");
console.log(tags)
  const navigate = useNavigate();

   const Chip = ({ label, onDelete }) => (
     <div className="inline-block font-semibold py-2 pl-3 capitalize w-fit text-white px-2 rounded-full bg-blue-400">
       <span>{label}</span>
       <button
         className="ml-2 text-gray-100 rounded-full text-center font-bold"
         onClick={onDelete}
       >
         <FontAwesomeIcon className="w-3 text-red-600" icon={faXmark} />
       </button>
     </div>
   );

   const handleAddTags = (e) => {
     e.preventDefault();
     if (tagsInput.trim() !== "" && !tags.includes(tagsInput)) {
       if (tags.length < 5) {
         setTags([...tags, tagsInput]);
         setTagsInput("");
       } else {
         alert("You can only add up to 5 skills.");
       }
     }
   };


   useEffect(() => {
     const fetchData = async () => {
       try {
         const response = await fetch(
           "http://localhost:8000/categoryApi/category"
         );
         const categoryData = await response.json();
         setCategories(categoryData);
       } catch (err) {
         console.log(err);
       }
     };
     fetchData();
   }, []);
   console.log("Testing");
   useEffect(() => {
     if (selectedCategory && selectedCategory !== "other") {
       const fetchSubCategories = async () => {
         try {
           const response = await fetch(
             `http://localhost:8000/categoryApi/subcategories/${selectedCategory}`
           );
           const subCategoryData = await response.json();
           setSubCategories(subCategoryData);
         } catch (err) {
           console.log(err);
         }
       };
       fetchSubCategories();
     } else {
       setSubCategories([]);
     }
   }, [selectedCategory]);

   useEffect(() => {
     if (selectedSubCategory && selectedSubCategory !== "other") {
       const fetchSubSubCategories = async () => {
         try {
           const response = await fetch(
             `http://localhost:8000/categoryApi/subcategories/${selectedSubCategory}`
           );
           const subSubCategoryData = await response.json();
           setSubSubCategories(subSubCategoryData);
         } catch (err) {
           console.log(err);
         }
       };
       fetchSubSubCategories();
     } else {
       setSubSubCategories([]);
     }
   }, [selectedSubCategory]);


    const handleCategoryChange = (e) => {
      setSelectedCategory(e.target.value);
      setCategory_Id(e.target.value);
      setSelectedSubCategory(""); // Reset subcategory
      setSelectedSubSubCategory(""); // Reset sub-subcategory
    };

    const handleSubCategoryChange = (e) => {
      setSelectedSubCategory(e.target.value);
      setCategory_Id(e.target.value);
      setSelectedSubSubCategory(""); // Reset sub-subcategory
    };

    const handleSubSubCategoryChange = (e) => {
      setSelectedSubSubCategory(e.target.value);
      setCategory_Id(e.target.value);
    };
   const handleDeleteTags = (tagsToDelete) => {
     const updatedTags = tags.filter((tag) => tag !== tagsToDelete);
     setTags(updatedTags);
   };

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
    formData.append("tags", tags);
    if (image) formData.append("image", image);
    if (modelFile) formData.append("modelFile", modelFile);

    try {
      const response = await fetch(
        `http://localhost:8000/modelApi/updateModel/${modelId}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.error) {
        console.log(data.error);
      } else {
        console.log("Model updated successfully:", data);
        navigate(`/model/${modelId}`); 
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
            <select
              value={selectedCategory === "other" ? "other" : selectedCategory}
              onChange={handleCategoryChange}
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            >
              <option value="">Select Category</option>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.name}
                  </option>
                ))}
              <option value="other">Other</option>
            </select>
            {selectedCategory === "other" && (
              <>
                <label htmlFor="customCategory">Type Category</label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                />
              </>
            )}
            <div>
              {selectedCategory && selectedCategory !== "other" && (
                <>
                  <select
                    value={
                      selectedSubCategory === "other"
                        ? "other"
                        : selectedSubCategory
                    }
                    onChange={handleSubCategoryChange}
                    className="mb-4 p-2 border border-gray-300 rounded w-full"
                  >
                    <option value="">Select Sub Category</option>
                    {Array.isArray(subcategories) &&
                      subcategories.map((subCategory) => (
                        <option
                          key={subCategory.category_id}
                          value={subCategory.category_id}
                        >
                          {subCategory.name}
                        </option>
                      ))}
                    <option value="other">Other</option>
                  </select>
                </>
              )}
            </div>
            {selectedSubCategory === "other" && (
              <>
                <label htmlFor="customSubCategory">Type Sub Category</label>
                <input
                  type="text"
                  value={customSubCategory}
                  onChange={(e) => setCustomSubCategory(e.target.value)}
                />
              </>
            )}
            <div>
              {selectedSubCategory && selectedSubCategory !== "other" && (
                <>
                  <select
                    value={
                      selectedSubSubCategory === "other"
                        ? "other"
                        : selectedSubSubCategory
                    }
                    onChange={handleSubSubCategoryChange}
                    className="mb-4 p-2 border border-gray-300 rounded w-full"
                  >
                    <option value="">Select Sub Sub Category</option>
                    {Array.isArray(subSubcategories) &&
                      subSubcategories.map((subSubCategory) => (
                        <option
                          key={subSubCategory.category_id}
                          value={subSubCategory.category_id}
                        >
                          {subSubCategory.name}
                        </option>
                      ))}
                    <option value="other">Other</option>
                  </select>
                </>
              )}
            </div>
            {selectedSubSubCategory === "other" && (
              <>
                <label htmlFor="customSubSubCategory">
                  Type Sub Sub Category
                </label>
                <input
                  type="text"
                  value={customSubSubCategory}
                  onChange={(e) => setCustomSubSubCategory(e.target.value)}
                />
              </>
            )}
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
                  onClick={
                    handleAddTags
                  }
                >
                  Add Tag
                </button>
              </div>
              <div className="space-x-2">
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleDeleteTags(tag)}
                  />
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

