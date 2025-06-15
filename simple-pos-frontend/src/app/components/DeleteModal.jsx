

export default function DeleteModal({isDeleteModalVisible, setIsDeleteModalVisible, currentFuneralId, setCurrentFuneralId, currentDeceasedName, setCurrentDeceasedName, currentInvoiceUrl, setCurrentInvoiceUrl, fetchData}) {

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleDeleteFuneral = async(funeralId, invoiceUrl) => {
        console.log('Deleting funeral with id : ', funeralId);
        console.log('invoice url : ', invoiceUrl)
        try {
            const response = await fetch(`${API_URL}/funerals/${funeralId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({'invoiceUrl': invoiceUrl}),
                
            });

            if (!response.ok) { throw new Error('Failed to DELETE funeral')};
            
            const data = await response.json();
            console.log('Successfully deleted - ', data);

        } catch (error) {
            console.error('Error:', error);
        }

        await fetchData();
        setCurrentInvoiceUrl('');
        setIsDeleteModalVisible(false);
    }

    return (

        <div id="deleteModalContainer" className={`flex p-2 flex-col fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 bg-blue-200 z-10 shadow-md rounded-sm w-1/4 h-1/5 ${isDeleteModalVisible ? 'visible' : 'hidden'}`} >
            <div className="flex justify-end"><button onClick={() => {setIsDeleteModalVisible(false)}}>X</button></div>
            <div id="textSection" className="flex flex-col text-center">
                <h2>Delete : {currentDeceasedName}</h2>
                <h3>Are you sure?</h3>
            </div>
            <div className="flex w-full justify-center">
                <button className="p-3 m-2 bg-gray-500 w-1/3 bold rounded-md text-white" onClick={() => {setCurrentFuneralId(''), setCurrentDeceasedName(''), setIsDeleteModalVisible(!isDeleteModalVisible)}}>No</button>
                <button className="p-3 m-2 bg-gray-500 w-1/3 bold rounded-md text-white" onClick={() => {handleDeleteFuneral(currentFuneralId, currentInvoiceUrl)}}>Yes</button>
            </div>
        </div>
    )
}