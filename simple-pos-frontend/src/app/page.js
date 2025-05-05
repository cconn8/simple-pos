import Image from "next/image";

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

const itemCategories = [
  {
    name : "Coffin",
    items : [
      {
        name : "Light Leinster",
      },
      {
        name : "The Kilmacduagh",
      },
      {
        name : "The Galwegian",
      }]
  },
  {
    name : "Flowers",
    items : [
      {
        name : "Fresh Floral Arrangements",
      },
      {
        name : "Standard Coffin Spray",
      },
      {
        name : "5 x Red Roses",
      }]
  },
  {
    name : "Music",
    items : [
      {
        name : "Carla & Carmel",
      },
      {
        name : "Frankie Colohan",
      },
      {
        name : "Ailbhe Hession",
      }]
  },
]

export default function Home() {
  return (
    <div id="container">
      <div id="funeral-arrangements-div">
        {informationCategories.map((category) => (
          <div key={category.name}>
            <h2 key={category.name}>{category.name}</h2>
            <div key={category.name} id="category-fields-div">
              {category.fields.map((field) => (
                <div style={{border: 'groove'}} key={field.name}>{field.name}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
