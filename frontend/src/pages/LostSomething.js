import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import API_ENDPOINTS from "../config/api.js";

function LostSomething() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: "",
    locationLost: "",
    description: "",
    phoneNumber: "",
    emailAdress: "",
    image: null,
  });

  const [preview, setImagePreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const folder = "lost-items";
    const { url, imageName } = await fetch(
      API_ENDPOINTS.generateUrl(folder)
    )
      .then((res) => res.json())
      .catch((err) => {
        console.error("Error generating URL:", err);
        return { url: null, imageName: null };
      });

    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": formData.image.type },
      body: formData.image,
    });

    const imageUrl = url.split("?")[0];

    formData.imageName = imageName;
    const auth = getAuth();
    const user = auth.currentUser;
    // creating a new json object with only some of the form fields and username
    const data = {
      userId: user.uid,
      itemName: formData.itemName,
      locationLost: formData.locationLost,
      description: formData.description,
      imageName: imageName,
      foundItemMatch: "none",
    };

    console.log(JSON.stringify(data));
    const response = await fetch(API_ENDPOINTS.saveLostSomething, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    // need to edit the response_data to include the item_id
    const response_data = await response.json()
    const matches = response_data.matches
    const lostItemId = response_data.lostItemId
    navigate("/MatchesForLostItem", {
      state: {
        matches: matches,
        lostItemId: lostItemId,
      }
    })
    //need a navigation route here to matches page
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
      <h1 className="form-title">Report Lost Item</h1>
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
          <label className="form-label">Where did you lose it?</label>
          <input
            type="text"
            name="locationLost"
            className="form-input"
            placeholder="Enter location"
            value={formData.locationLost}
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
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            className="form-input"
            placeholder="Enter your phone number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="emailAdress"
            className="form-input"
            placeholder="Enter your email address"
            value={formData.emailAdress}
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
            className={`form-input ${formData.image ? "has-file" : ""}`}
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
                  border: "1px solid var(--border-color)",
                }}
              />
            </div>
          </div>
        )}

        <button type="submit" className="form-button">
          Submit Report
        </button>
      </form>
    </div>
  );
}

export default LostSomething;
