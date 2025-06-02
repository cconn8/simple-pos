
// Takes a list of item objects (eg. products) by type (eg. coffin)
// Displays them as POS tiles in a group on the screen

export function DisplayGroupTiles({groupedItemsByType, formData, setFormData}) {

    const handleItemClick = (item) => {
        console.log('handleItem clicked! :', item);
        setFormData((prev) => {
            const existingItems = prev.selectedItems || []; //creates an empty 'selectedItems : []' array if not exists

            return {
                ...prev,
                selectedItems : [...existingItems, item],
            };
        });  
        console.log('updated form data is : ', formData)
    };

    return (
        Object.entries(groupedItemsByType).map( ([type, items]) => (                               
            <div key={type}>
                <h3>{type}</h3>
                {items.map((item) => (
                    <button  
                        type="button"
                        key={item.name + Date.now()}
                        className="bg-blue-500 text-white p-8 rounded hover:bg-blue-600 m-1"
                        onClick={() => handleItemClick(item)} 
                        >
                            {item.name}
                    </button>
                ))}
            </div>
        )));

}