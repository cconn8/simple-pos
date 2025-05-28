import { v4 as uuidv4 } from 'uuid';
// import offdLogo from "../../../../public/offdLogo.png";
import Image from 'next/image';
import dynamic from 'next/dynamic';

const styles = {
  margin : 'auto',
  border : 'groove'
} 


const items = [{
                id : uuidv4(),
                title : "Light Leinster",
                price : 250,
                currency : "€",
                description : "Beautiful, semi solid coffin with high gloss finish, satin sheets and golden barrel mountings",
                category: 'product'
              },
              {
                id : uuidv4(),
                title : "Dark Leinster",
                price : 250,
                currency : "€",
                description : "Beautiful, semi solid coffin with high gloss finish, satin sheets and golden barrel mountings",
                category: 'product'
              },
              {
                id : uuidv4(),
                title : "Timber Leinster",
                price : 250,
                currency : "€",
                description : "Beautiful, semi solid coffin with high gloss finish, satin sheets and golden barrel mountings"
              },
              {
                id : uuidv4(),
                title : "Rustic Oak",
                price : 250,
                currency : "€",
                description : "Beautiful, semi solid coffin with high gloss finish, satin sheets and golden barrel mountings",
                category: 'product'
              },
              {
                id : uuidv4(),
                title : "Professional Service Fees",
                price : 250,
                currency : "€",
                description : "Professional care and transport of the deceased. Hygienic preperation and presentation of the deceased. Facilitation of the funeral on the dates. ",
                category: 'service'
              },
              {
                id : uuidv4(),
                title : "The Galwegian",
                price : 250,
                currency : "€",
                description : "",
                category: 'service'
              },
              {
                id : uuidv4(),
                title : "Wax Macroom",
                price : 250,
                currency : "€",
                description : "",
                category: 'service'
              },
              {
                id : uuidv4(),
                title : "Wicker Basket",
                price : 250,
                currency : "€",
                description : "",
                category: 'product'
              },
              {
                id : uuidv4(),
                title : "Solid Oak Antique",
                price : 250,
                currency : "€",
                description : "",
                category : "disbursement"
              }
        ]
// const LogoImage = dynamic(() => import("../../../../public/offdLogo.png"));

export default function Invoice({formData}) {

  const serviceItems = items.filter((item) => item.category == "service")
  const productItems = items.filter((item) => item.category == "product")
  const disbursementItems = items.filter((item) => item.category == "disbursement")

  return (
    <main className="m-5 p-5 xl:max-w-4xl md:max-w-xl lg:max-w-xl mx-auto bg-white">
      <header className="flex-column justify-center mb-5 xl:flex-row xl:justify-between">
      {/* Header */}
          <div className="flex font-bold uppercase tracking-wide text-4xl mb-3 text-center justify-end">
            <img src='/offd-logo.png' alt="dynamic logo image" width={150} height={150} />
          </div>
      </header>
      {/*End of Header */}

      {/* Company Details */}
      <section className="flex flex-col items-end my-2">
        <h2 className="text-m uppercase">O'Flaherty Funeral Directors</h2>
        <p>Munster Avenue, Galway</p>
      </section>
      {/* End of Company Details */}


      <div className='flex flex-row justify-between border-b my-2'>
          {/* Client Details */}
          <section className="">
            <h2>C/O Representatives of the late Mary Murphy deceased</h2>
            <h2>John Murphy</h2>
            <p>Moylan Park, Galway City, Galway</p>
          </section>
          {/* End of Client Details */}


          {/* Dates */}
          <section className="flex flex-col items-end">
            <ul>
              <li><span className="bold">Invoice Number:</span> 2347</li>
              <li><span className="bold">Invoice Date:</span> 21 May 2025</li>
              <li><span className="bold">Due Date:</span> 31 May 2025</li>
            </ul>
          </section>
          {/* ENd of Dates */}
      </div>


      {/* Table Here */}
      <table className="table-auto border-collapse w-full my-2">
        {/* Table Headings */}
        <thead className="bg-gray-100">
          <tr>
            <th className=" px-4 py-2 text-left">Item</th>
            <th className=" px-4 py-2 text-left">Unit Price</th>
            <th className=" px-4 py-2 text-left">Total</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {/* Services Section */}
          <h2 className='py-2 font-bold italic'>Our Services</h2>
          {serviceItems.map((item, index) => (
            <tr key={index}>
              <td className="border-r px-4 py-2">
                <div className="space-y-1">
                  <p className="font-bold">{item.title}</p>
                  <p>{item.description}</p>
                </div>
              </td>
              {/* <td className="border px-4 py-2">{item.description}</td> */}
              <td className="border-r px-4 py-2">{item.price}</td>
              <td className="px-4 py-2">{item.price}</td>
            </tr>
          ))}

          {/* Products Section */}
          <h2 className='py-2 font-bold italic'>Selection of Funeral Items</h2>
          {productItems.map((item, index) => (
            <tr key={index}>
              <td className="border-r px-4 py-2">
                <div className="space-y-1">
                  <p className="font-bold">{item.title}</p>
                  <p>{item.description}</p>
                </div>
              </td>
              {/* <td className="border px-4 py-2">{item.description}</td> */}
              <td className="border-r px-4 py-2">{item.price}</td>
              <td className="px-4 py-2">{item.price}</td>
            </tr>
          ))}

          {/* Disbursements Section */}
          <h2 className='py-2 font-bold italic'>External Payments on the clients behalf</h2>
          {disbursementItems.map((item, index) => (
            <tr key={index}>
              <td className="border-r px-4 py-2">
                <div className="space-y-1">
                  <p className="font-bold">{item.title}</p>
                  <p>{item.description}</p>
                </div>
              </td>
              {/* <td className="border px-4 py-2">{item.description}</td> */}
              <td className="border-r px-4 py-2">{item.price}</td>
              <td className="px-4 py-2">{item.price}</td>
            </tr>
          ))}

        </tbody>
      </table>


      <footer>
        <ul className='flex flex-row mx-2 justify-between'>
          <li>Company Name</li>
          <li>Company Email</li>
          <li>Company Phone</li>
          <li>Bank Name</li>
          <li>Bank Account</li>
        </ul>
      </footer>


    </main>
  );
}
