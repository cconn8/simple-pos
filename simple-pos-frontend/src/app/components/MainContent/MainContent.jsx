import React from "react";

export default function MainContent({categories, formData, setFormData, selectedItems, setSelectedItems}) {

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setFormData( (prev) => ({
            ...prev,
            [name] : value,
        }));
        console.log('setting form data: ', formData)
        };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting form: ', {...formData, selectedItems})
    }

    function onItemClick(item) {
        console.log('Item Button clicked! Here is what is passed : ', item);
        setSelectedItems((prevItems) => [...prevItems, {...item, id : item.id || item.title + Date.now()}]);
    };

    return(
        <div id="main-content-div">
            <form onSubmit={handleSubmit}>
                <div id="data-container">
                    {/* Each Data Category is mapped to a section */}
                    {categories.map((category) => (
                        <div className="my-4 p-5" key={category.id} id="data-section-container">
                            <h2>{category.display_text}</h2>
                            <div id="data-fields-container">
                                {category.fields ?
                                    category.fields.map( (field) => (
                                    <input 
                                        name={field.name}
                                        key={field.id}
                                        value={formData[field.name] || "" }
                                        type={field.type}
                                        placeholder={field.display_text}
                                        onChange={handleChange}
                                    />
                                )) : 
                                category.items && 
                                    category.items.map( (item) => (
                                    <button  
                                        type="button"
                                        key={item.id || item.title + Date.now()}
                                        className="bg-blue-500 text-white p-10 rounded hover:bg-blue-600 m-1" 
                                        onClick={ () => onItemClick(item)}>
                                            {item.title}
                                    </button>
                                ))}
                                <button type="button" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-red-600 m-2"> + Add Item</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button type="submit" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-red-600 m-2"ç>SAVE!</button>
            </form>
        </div>
            
    )

}