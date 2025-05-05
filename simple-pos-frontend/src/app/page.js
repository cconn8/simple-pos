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

const styles = {
  margin : 'auto',
  border : 'groove'
}

export default function Home() {
  return (
    <div id="container">
      <div id="funeral-arrangements-div">
        <h1><b>Vital Information</b></h1>
        {informationCategories.map((category) => (
          <div key={category.name}>
            <h2 key={category.name}>{category.name}</h2>
            <div key={category.name} id="category-fields-div">
              {category.fields.map((field) => (
                <input style={styles} type={field.type} key={field.name} placeholder={field.name} />
              ))}
            </div>
          </div>
        ))}

        <h1><b>Products & Services</b></h1>
        {itemCategories.map((category) => (
          <div key={category.name}>
            <h2 key={category.name}>{category.name}</h2>
            <div className="flex flex-row" key={category.name} id="category-items-div">
              {category.items.map((item) => (
                <div style={{border: 'groove'}} key={item.name}>
                  <h3>{item.name}</h3>
                  <h4 style={{justifyContent: 'start'}}>Add</h4>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
