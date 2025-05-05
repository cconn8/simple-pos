import React from "react";

const informationCategories = [
    {
      name : "Deceased Details",
      fields : [{
        name : "DeceasedName",
        type : "text"
      },
      {
        name : "DateOfDeath",
        type : "date"
      },
      {
        name : "LastAddress",
        type : "text"
      }]
    },
    {
      name : "Client Details",
      fields : [{
        name : "ClientName",
        type : "text"
      },
      {
        name : "BillingAddress",
        type : "text"
      },
      {
        name : "Phone",
        type : "number"
      }]
    }
  ]


export default function CategorySection() {

    return (
        <>
            {informationCategories.map((category) => (

                <div className="space-y-6" key={category.name} id="category-section-div">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">{category.name}</h2>
                    <div id="category-fields-div">
                        {category.fields.map((field) => (
                            <input 
                                key={field.name}
                                type={field.type} 
                                placeholder={field.name}
                                className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            />
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
}