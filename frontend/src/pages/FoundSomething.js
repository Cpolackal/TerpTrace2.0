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
    setFormData((prevState) => ({
      ...prevState,
      image: file,
    }));
    console.log(file);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  return (
    <div className="page-center">
      <h1>Report Found Item</h1>
      <form className="report-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="itemName"
          placeholder="What is it?"
          value={formData.itemName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="locationFound"
          placeholder="Where did you find it?"
          value={formData.locationFound}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Color, Material etc."
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="returnedTo"
          placeholder="Where did you return it?"
          value={formData.returnedTo}
          onChange={handleChange}
          required
        />
        <div className="image-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {preview && (
            <div className="image-preview">
              <img
                src={preview}
                alt="Preview"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            </div>
          )}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default FoundSomething;
