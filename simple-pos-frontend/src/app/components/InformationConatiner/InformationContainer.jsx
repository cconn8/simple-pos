import React from "react";

export default function InformationContainer({categories}) {

    return (
        <div id="information-container">

            <h1 className="my-5 underline"><b>Vital Information</b></h1>

            {categories.map( (category) => (
                <div className="my-4 p-4 border" key={category.title} id="information-section-container">
                    <h2>{category.title}</h2>
                    <div id="information-fields-container">
                        {category.fields.map( (field) => (
                            <input 
                                key={field.title}
                                type={field.type}
                                placeholder={field.title}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

}