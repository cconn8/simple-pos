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
                description : "Beautiful, semi solid coffin with high gloss finish, satin sheets and golden barrel mountings"
              },
              {
                id : uuidv4(),
                title : "Dark Leinster",
                price : 250,
                currency : "€",
                description : "Beautiful, semi solid coffin with high gloss finish, satin sheets and golden barrel mountings"
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
                description : "Beautiful, semi solid coffin with high gloss finish, satin sheets and golden barrel mountings"
              },
              {
                id : uuidv4(),
                title : "The Kilmacduagh",
                price : 250,
                currency : "€",
                description : ""
              },
              {
                id : uuidv4(),
                title : "The Galwegian",
                price : 250,
                currency : "€",
                description : ""
              },
              {
                id : uuidv4(),
                title : "Wax Macroom",
                price : 250,
                currency : "€",
                description : ""
              },
              {
                id : uuidv4(),
                title : "Wicker Basket",
                price : 250,
                currency : "€",
                description : ""
              },
              {
                id : uuidv4(),
                title : "Solid Oak Antique",
                price : 250,
                currency : "€",
                description : ""
              }
        ]
// const LogoImage = dynamic(() => import("../../../../public/offdLogo.png"));

export default function Invoice({formData}) {
  return (
    <main className="m-5 p-5 xl:max-w-4xl md:max-w-xl lg:max-w-xl mx-auto bg-white">
      <header className="border flex-column justify-center mb-5 xl:flex-row xl:justify-between">
      {/* Header */}
          <div className="font-bold uppercase tracking-wide text-4xl mb-3 text-center">
            <img className="justify-end" src='/offdLogo.png' alt="dynamic logo image" width={150} height={150} />
          </div>
          <div id="buttons-div" className="flex justify-center">
                  <button className="btn btn-print m-1 underline">Print</button>
                  <button className="btn btn-download m-1 underline">Download</button>
                  <button className="btn btn-send m-1 underline">Send</button>
          </div>
      </header>
      {/*End of Header */}

      {/* Company Details */}
      <section className="flex flex-col items-end m-2 ">
        <h2 className="text-xl uppercase">O'Flaherty Funeral Directors</h2>
        <p>Munster Avenue, Galway</p>
      </section>
      {/* End of Company Details */}

      {/* Client Details */}
      <section className="">
        <h2>John Murphy</h2>
        <p>Moylan Park, Galway City, Galway</p>
      </section>
      {/* End of Client Details */}


      {/* Dates */}
      <section className="flex flex-col items-end my-5 border-b">
        <ul>
          <li>Invoice Number</li>
          <li>Invoice Date</li>
          <li>Due Date</li>
        </ul>
      </section>
      {/* ENd of Dates */}


      {/* Table Here */}
      <table className="table-auto border-collapse w-full border">
        {/* Table Headings */}
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Item</th>
            <th className="border px-4 py-2 text-left">Unit Price</th>
            <th className="border px-4 py-2 text-left">Total</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {items.map((item, index) => (
            <tr className="border-b" key={index}>
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

      {/* Notes */}
      <section>
        {/* Textarea */}
        <p>Notes..</p>
      </section>
      {/* End of Notes */}


      <footer>
        <ul>
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
