import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

function FoundSomething() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: "",
    locationFound: "",
    description: "",
    returnedTo: "",
    image: null,
  });

  const [preview, setImagePreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const folder = "found-items"; // Specify the folder for found items
    const { url, imageName } = await fetch(
      `http://localhost:5001/generate-url?folder=${folder}`
    )
      .then((res) => res.json())
      .catch((err) => {
        console.error("Error generating URL:", err);
        return { url: null, imageName: null };
      });

    // This brings the signed URL from the backend (s3.js)

    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": formData.image.type },
      body: formData.image,
    });
    const imageUrl = url.split("?")[0];
    console.log(imageUrl);
    // this uploads the image to s3 and saves the base url

    formData.imageName = imageName;
    console.log("✅ JSON.stringify result:", JSON.stringify(formData));
    const response = await fetch("http://localhost:5001/saveFoundSomething", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const response_data = await response.json()
    const matches = response_data.matches
    console.log(matches)
    navigate("/MatchesForFoundItem", {
      state: {
        matches: matches
      }
    })
    // need a navigation route to the matches page here
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    // Clear previous preview if it exists
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        image: file,
      }));
      console.log(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    } else {
      // If no file selected (user cancelled), clear the image and preview
      setFormData((prevState) => ({
        ...prevState,
        image: null,
      }));
      setImagePreview(null);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Report Found Item</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">What is it?</label>
          <input
            type="text"
            name="itemName"
            className="form-input"
            placeholder="Enter item name"
            value={formData.itemName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Where did you find it?</label>
          <input
            type="text"
            name="locationFound"
            className="form-input"
            placeholder="Enter location"
            value={formData.locationFound}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-textarea"
            placeholder="Color, material, size, etc."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Where did you return it?</label>
          <input
            type="text"
            name="returnedTo"
            className="form-input"
            placeholder="Enter return location"
            value={formData.returnedTo}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={`form-input ${formData.image ? 'has-file' : ''}`}
            required
          />
        </div>
        
        {preview && (
          <div className="form-group">
            <label className="form-label">Image Preview</label>
            <div className="image-preview">
              <img
                src={preview}
                alt="Preview"
                style={{ 
                  maxWidth: "100%", 
                  maxHeight: "200px", 
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)"
                }}
              />
            </div>
          </div>
        )}
        
        <button type="submit" className="form-button">Submit Report</button>
      </form>
    </div>
  );
}

export default FoundSomething;
