import Image from "next/image";
<<<<<<< HEAD
import InformationContainer from "./components/InformationConatiner/InformationContainer";
=======
>>>>>>> d56167b0c28d72597d74c712d25737eba8b53eec
import MainContent from "./components/MainContent/MainContent";
import Layout from "./components/Layout/Layout";

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



const styles = {
  margin : 'auto',
  border : 'groove'
}

export default function Home() {
  return (
    <Layout />
  );
}
