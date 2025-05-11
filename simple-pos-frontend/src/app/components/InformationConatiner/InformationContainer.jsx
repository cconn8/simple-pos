"use client"
import React, { useState } from "react";

export default function InformationContainer({categories, formData, setFormData}) {

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setFormData( (prev) => ({
            ...prev,
            [name] : value,
        }));
        console.log('setting form data: ', formData)
      };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting form: ', formData)
    }

    return (
        <div id="information-container" className="p-5 shadow-md">

            <form onSubmit={handleSubmit}>
                <h1 className="my-5 underline"><b>Vital Information</b></h1>

                {categories.map( (category) => (
                    <div className="my-4 p-5" key={category.id} id="information-section-container">
                        <h2>{category.display_text}</h2>
                        <div id="information-fields-container">
                            {category.fields.map( (field) => (
                                <input 
                                    name={field.name}
                                    key={field.id}
                                    value={formData[field.name] || "" }
                                    type={field.type}
                                    placeholder={field.display_text}
                                    onChange={handleChange}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            
                <button id="submit-button" type="submit" className="bold p-2 border rounded bg-gray-200 hover:bg-blue-400" >Save Details</button>
            
            </form>

        </div>
    );

}