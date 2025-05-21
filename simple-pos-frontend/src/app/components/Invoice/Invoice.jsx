
const styles = {
  margin : 'auto',
  border : 'groove'
}

export default function Invoice({formData}) {
  return (
    <main className="m-5 p-5 xl:max-w-4xl md:max-w-xl lg:max-w-auto mx-auto bg-white">
      <header className="border flex-column justify-center mb-5 xl:flex-row xl:justify-between">
      {/* Header */}
          <h2 className="font-bold uppercase tracking-wide text-4xl mb-3 text-center">O'Flaherty Logo</h2>
          <div id="buttons-div" className="flex justify-center">
                  <button className="btn btn-print m-1 underline">Print</button>
                  <button className="btn btn-download m-1 underline">Download</button>
                  <button className="btn btn-send m-1 underline">Send</button>
          </div>
      </header>
      {/*End of Header */}

      {/* Company Details */}
      <section className="flex flex-col items-end m-2 ">
        <h2 className="text-xl uppercase">Company Name</h2>
        <p>Company Address</p>
      </section>
      {/* End of Company Details */}

      {/* Client Details */}
      <section className="">
        <h2>Client Name</h2>
        <p>Client Address</p>
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
      <table className="border">
        <tr className="border justify-between">
          <td>Item</td>
          <td>Description</td>
          <td>Unit Price</td>
          <td>Total</td>
        </tr>
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
