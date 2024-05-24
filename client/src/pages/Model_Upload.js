import React, { useEffect, useState } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
  faTrash,
  faXmark,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Model_Upload = () => {
  const [categories, setCategories] = useState([]); // Initialize as an empty array
  const [selectedCategory, setSelectedCategory] = useState(""); // Separate state for selected category
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [image, setImage] = useState(null); // Default to null
  const [tags, setTags] = useState([]);
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/categoryApi/category`
        );

        const categoryData = await response.json();
        setCategories(categoryData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Categories fetched:", categories);
  }, [categories]);

  const Chip = ({ label, onDelete }) => {
    return (
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
  };

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

  const handleDeleteTags = (tagsToDelete) => {
    const updatedTags = tags.filter((tag) => tag !== tagsToDelete);
    setTags(updatedTags);
  };

  return (
    <div className="main_div">
      <div className="form_div">
        <form action="">
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
              value={selectedCategory} // Ensure the selected value is correctly handled
              onChange={(e) => setSelectedCategory(e.target.value)}
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
            {selectedCategory === "other" ? (
              <>
                <label htmlFor="category">Type Category</label>
                <input
                  type="text"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />
              </>
            ) : null}
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
            <label htmlFor="price">Enter Price</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="is_free">Is It Paid?</label>
            <input
              type="radio"
              checked={!isFree}
              onChange={() => setIsFree(false)}
            />{" "}
            Paid
            <input
              type="radio"
              checked={isFree}
              onChange={() => setIsFree(true)}
            />{" "}
            Free
          </div>
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
                  onClick={handleAddTags}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                  Add Tags
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
        </form>
        <div>
          <div>
            <label htmlFor="image">Upload Image</label>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
        </div>
      </div>
    </div>
  );
};
