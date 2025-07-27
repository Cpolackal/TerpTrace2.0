import React, { useState } from "react";

function LostSomething() {
  const [formData, setFormData] = useState({
    itemName: "",
    locationLost: "",
    description: "",
    phoneNumber: "",
    emailAdress: "",
    image: null,
  });

  const [preview, setImagePreview] = useState(null);

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
        input
        <input
          type="text"
          name="locationLost"
          placeholder="Where did you lose it?"
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
  );
}

export default LostSomething;
