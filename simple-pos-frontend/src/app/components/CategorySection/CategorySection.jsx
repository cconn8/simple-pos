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
                                className=" flex rounded-sm bg-white p-1 shadow-lg outline outline-black/10dark:shadow-none  dark:outline-white/10"
                            />
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
}