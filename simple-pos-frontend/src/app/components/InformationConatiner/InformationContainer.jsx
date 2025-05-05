import React from "react";
import CategorySection from "../CategorySection/CategorySection";
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

export default function InformationContainer() {

    return (
        <>
            <CategorySection />
        </>
    );

}