import Image from "next/image";
import InformationContainer from "./components/InformationConatiner/InformationContainer";

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
    <InformationContainer />
  );
}
