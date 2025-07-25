import React, { useEffect, useState } from "react";

function FoundSomething() {
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
          value={formData.locationFound}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="returnedTo"
          placeHolder="Where did you return it?"
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
