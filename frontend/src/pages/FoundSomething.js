import React, { useEffect, useState } from "react";

function FoundSomething() {
const [formData, setFormData] = useState({
        itemName: '',
        locationFound: '',
        description: '',
        returnedTo: '',
        image: null
});


  
const handleSubmit = async(e) => {
    e.preventDefault()
}

const handleChange = (e) => {
    const { name, value } = e.target
}
  
return(
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
                <div className = 'image-upload'>
                    <input
                        type="file"
                        accept="image/*"
                        onChange=hand
                    />
                </div>
                </form>
            </div>
  );
}

export default FoundSomething;
