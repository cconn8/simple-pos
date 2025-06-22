
// Takes a list of item objects (eg. products) by type (eg. coffin)
// Displays them as POS tiles in a group on the screen
import {v4 as uuidv4} from 'uuid';

export function DisplayGroupTiles({
                                    items, 
                                    formData, 
                                    setFormData, 
                                    category, 
                                    rowItems, 
                                    setRowItems, 
                                    isCreateInventoryModalVisible, 
                                    setIsCreateInventoryModalVisible,
                                    temporaryAddedItem,
                                    setTemporaryAddedItem}) {

    // console.log('Display Tiles Called...');

    // Group by type within this category
    const groupedItemsByType = items.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push(item);
        return acc;
    }, {});

    if(temporaryAddedItem.length > 0) {
        temporaryAddedItem.map((item) => {
            if(!groupedItemsByType[item.type]) groupedItemsByType[item.type] = [];
            groupedItemsByType[item.type].push(item);
        })
    }

    // console.log('HELLO grouped by type is  :' , groupedItemsByType);


    const handleItemClick = (item) => {
        console.log('handleItem clicked! :', item);
        setFormData((prev) => {
            const existingItems = prev.selectedItems || []; //creates an empty 'selectedItems : []' array if not exists

            return {
                ...prev,
                selectedItems : [...existingItems, item],
            };
        });  
        // console.log('updated form data is : ', formData)
    };

    const handleAddItemButtonClick = (category, type) => {
        // open the create inventory modal
        // console.log('Handle Add Item clicked with category and type :', category, type);
        setIsCreateInventoryModalVisible(true); 
        setRowItems([
            {
                _id: uuidv4(), name: '' , 
                category : category, 
                type : type, 
                description : '', 
                isBillable : '', 
                price : ''}
        ]); 
        console.log('handleAddItemsButtonCliciked = items is set to ', rowItems);

    }

    console.log('DisplayGroupTile - TemporaryAddedItem is : ', temporaryAddedItem );

    return (
        <div>
            {Object.entries(groupedItemsByType).map(([type, items]) => (
                <div key={type} className="mt-4">
                    <h4 className="text-md font-semibold mb-2">{type}</h4>

                    <div className="flex flex-wrap">
                        {items.map((item, index) => (
                        <button
                            key={`${item.name}-${index}`}
                            type="button"
                            className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 m-1"
                            onClick={() => handleItemClick(item)}
                        >
                            {item.name}
                        </button>
                        ))}
                    </div>

                    <button type="button" className="p-3 bg-red-500 text-white rounded hover:bg-red-600 m-1" onClick={() => handleAddItemButtonClick(category, type)}>
                        + Add Item
                    </button>
                </div>
            ))}
        </div>
    );
};
