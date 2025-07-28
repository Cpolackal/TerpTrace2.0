import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Logo from "../components/Logo";

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
      `http://localhost:5001/generate-url?folder=${folder}`
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
    const response = await fetch("http://localhost:5001/saveLostSomething", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const response_data = await response.json()
    const matches = response_data.matches
    navigate("/MatchesForLostItem", {
      state: {
        matches: matches
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
    setFormData((prevState) => ({
      ...prevState,
      image: file,
    }));
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  return (
    <>
      <Logo />
      <div className="page-center">
      <h1>Report Lost Item</h1>
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
          name="locationLost"
          placeholder="Where did you lose it?"
          value={formData.locationLost}
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
          name="phoneNumber"
          placeholder="Your phone number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="emailAdress"
          placeholder="Your email address"
          value={formData.emailAdress}
          onChange={handleChange}
          required
        />
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
        <button type="submit">Submit</button>
      </form>
      </div>
    </>
  );
}

export default LostSomething;
