

"use client";

//open the funeral modal on the funerals page
//render the inventory

import { useFuneralsContext } from "@/contexts/FuneralsContext";
import { FUNERAL_TEMPLATE_A, DESIRED_CATEGORY_ORDER } from "@/config/funeral-categories";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useInventoryContext } from "@/contexts/InventoryContext";
import { 
  FieldElementProps, 
  SectionContainerProps, 
  InventoryItem, 
  SelectedFuneralItem, 
  ProductSectionProps, 
  ProductTileProps,
  FuneralFormData,
  FuneralItem,
  FuneralSummaryProps,
  // PaymentStatus removed for redesign
} from "@/types";
import { FuneralDataV2 } from "@/types/funeralV2";
import { useFuneralsV2 } from "@/hooks/useFuneralsV2";
import { Edit3, Trash2 } from "@deemlol/next-icons";
import dateFormat from 'dateformat';

function FieldElement(props: FieldElementProps & { value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void }) {
    let field;
    switch(props.type) {
        case("textarea"):
            field = (
                <textarea className="border border-gray-300 rounded px-1 font-small grow-1"
                    id={props.name}
                    name={props.name}
                    placeholder={props.placeholder || ""}
                    required={props.required}
                    value={props.value || ""}
                    onChange={props.onChange}
                />
            );
            break;
        case "dropdown":
            field = (
                <select className="border border-gray-300 rounded px-1 font-small grow-1"
                    id={props.name}
                    name={props.name}
                    required={props.required}
                    value={props.value || ""}
                    onChange={props.onChange}
                >
                    <option value="">Select...</option>
                    {props.options?.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            );
            break;
        default:
            field = (
                <input className="border border-gray-300 rounded px-1 font-small grow-1"
                    id={props.name}
                    type={props.type}
                    name={props.name}
                    placeholder={props.placeholder || ""}
                    required={props.required}
                    value={props.value || ""}
                    onChange={props.onChange}
                />
            );
            break;
    }

    return(
        <div id="input-field-container" className="p-1 m-1 flex flex-col justify-between gap-x-1">
            <label className="font-small" htmlFor={props.name}>{props.label}</label>
            {field}
        </div>
    )
}

function SectionContainer({children, heading, className} : SectionContainerProps) {
    if(!heading) heading="";
    return(
        <div id="funeral-info-container" className={`p-2 m-2 border border-2 border-gray-300 rounded shadow-sm bg-white ${className}`}>
            <h3 className="font-bold">{heading}</h3>
            {children}
            <button className="border border-gray-400 rounded p-1 bg-blue-500 text-white hover:bg-blue-700 text-xsmall w-small">+ Add Field</button>
        </div>
    )
}

// Product Search and Filter Component
function ProductSearchFilter({ 
    searchTerm, 
    onSearchChange, 
    selectedCategory, 
    onCategoryChange, 
    availableCategories 
}: {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    availableCategories: { name: string; displayName: string }[];
}) {
    return (
        <div className="mb-4 space-x-2 flex">
            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="flex flex-grow px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                    {searchTerm && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="mr-2 p-1 text-gray-400 hover:text-gray-600"
                            title="Clear search"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                    <div className="pr-3 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>
            
            {/* Category Filter */}
            <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="px-2 py-1 text-small border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="">All Categories</option>
                {availableCategories.map((category) => (
                    <option key={category.name} value={category.name}>{category.displayName}</option>
                ))}
            </select>
        </div>
    );
}

function ProductSection({ products, onProductSelect, selectedProducts }: ProductSectionProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    
    // Get available categories based on DESIRED_CATEGORY_ORDER
    const availableCategories = useMemo(() => {
        return DESIRED_CATEGORY_ORDER.filter(categoryOrder => 
            products.some(product => product.category === categoryOrder.name)
        );
    }, [products]);
    
    // Filter products based on search term and selected category
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = searchTerm === "" || 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);
    
    // Group filtered products by category and type using DESIRED_CATEGORY_ORDER
    const groupedProducts = useMemo(() => {
        const grouped: Record<string, { displayName: string; types: Record<string, InventoryItem[]> }> = {};
        
        // Initialize with ordered categories
        DESIRED_CATEGORY_ORDER.forEach(categoryOrder => {
            grouped[categoryOrder.name] = {
                displayName: categoryOrder.displayName,
                types: {}
            };
        });
        
        // Group products by category and type
        filteredProducts.forEach(product => {
            const category = product.category;
            const type = product.type;
            
            if (!grouped[category]) {
                grouped[category] = {
                    displayName: category,
                    types: {}
                };
            }
            
            if (!grouped[category].types[type]) {
                grouped[category].types[type] = [];
            }
            
            grouped[category].types[type].push(product);
        });
        
        // Remove empty categories
        Object.keys(grouped).forEach(category => {
            if (Object.keys(grouped[category].types).length === 0) {
                delete grouped[category];
            }
        });
        
        return grouped;
    }, [filteredProducts]);

    return(
        <div className="h-full flex flex-col">
            <ProductSearchFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                availableCategories={availableCategories}
            />
            
            <div className="flex-1 overflow-y-auto">
                {Object.keys(groupedProducts).length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                        <p>No products found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filter</p>
                    </div>
                ) : (
                    DESIRED_CATEGORY_ORDER.map(categoryOrder => {
                        const categoryData = groupedProducts[categoryOrder.name];
                        if (!categoryData || Object.keys(categoryData.types).length === 0) return null;
                        
                        return (
                            <div key={categoryOrder.name} className="mb-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">
                                    {categoryData.displayName}
                                </h3>
                                {Object.entries(categoryData.types).map(([type, typeProducts]) => (
                                    <div key={`${categoryOrder.name}-${type}`} className="mb-4">
                                        <h4 className="font-semibold text-gray-700 mb-2">
                                            {type} ({typeProducts.length})
                                        </h4>
                                        <div className="grid grid-cols-3 gap-2 border border-gray-200 rounded p-2">
                                            {typeProducts.map((product) => (
                                                <ProductTile 
                                                    key={product._id} 
                                                    {...product}
                                                    onSelect={onProductSelect}
                                                    onRemove={() => {}} // Not used in product selection
                                                    isSelected={selectedProducts.some(p => p._id === product._id)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    )
}

function ProductTile(props: ProductTileProps) {
    const handleProductClick = () => {
        props.onSelect(props);
    };

    const handleDeleteItem = (id : string) => {
        alert(`Do you wish to delete item : ${id}`);
    }

    return(
        <div onClick={handleProductClick} className={`relative my-1 flex rounded cursor-pointer transition-colors ${props.isSelected ? 'bg-blue-200 border-2 border-blue-400' : 'bg-gray-200 hover:bg-gray-300'}`}>
            <div className="p-2">
                <button onClick={() => {handleDeleteItem(props._id)}} className="hover:font-bold absolute top-1 right-1">x</button>
                <div className="text-sm font-medium">{props.name}</div>
                <div className="text-xs text-gray-600">€{props.price}</div>
            </div>
        
            {props.isSelected && (
                <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    ✓
                </div>
            )}
        </div>
    )
}



// Funeral Summary Component
function FuneralSummary({ formData, onClearAll, onSave, isEditMode }: Omit<FuneralSummaryProps, 'selectedItems' | 'onRemoveItem'> & { isEditMode: boolean }) {
    const { selectedFuneralItems, startEditingItem, removeFuneralItem } = useFuneralsContext();
    const total = selectedFuneralItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const formatFieldValue = (key: string, value: string | undefined): string => {
        if (!value) return "";
        if (key.toLowerCase().includes('date')){
            return dateFormat(value, "dddd, mmmm dS, yyyy");
            // return new Date(value).toLocaleDateString();
        }
        return value;
    };

    const getFieldDisplayName = (key: string): string => {
        const fieldMap: Record<string, string> = {
            deceasedName: "Deceased Name",
            dateOfDeath: "Date of Death", 
            lastAddress: "Last Address",
            clientName: "Client Name",
            clientAddress: "Client Address",
            clientPhone: "Client Phone",
            funeralNotes: "Funeral Notes",
            contactName1 : "Contact 1",
            phone1: "Contact 1 Phone",
            contactName2 : "Contact 2",
            phone2: "Contact 2 Phone",
            careOf : "C/O",
            billingName : "Billing Name",
            billingAddress : "Billing Address",
            fromDate : 'From',
            toDate : 'To'
        };
        return fieldMap[key] || key;
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
                {/* Form Data Section */}
                <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-2">Funeral Details</h4>
                    <div className="space-y-1">
                        {Object.entries(formData).map(([key, value]) => {
                            if (key === 'selectedItems') return null;
                            else if (value === '') return null;
                            return (
                                <div key={key} className="grid grid-cols-3 mt-1 text-small">
                                    <span className="font-bold text-gray-600">{getFieldDisplayName(key)}:</span>
                                    <span className="ml-1 text-gray-800 col-span-2">{formatFieldValue(key, value)}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Items Section */}
                <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Selected Items</h4>
                    {selectedFuneralItems.length === 0 ? (
                        <p className="text-gray-500 text-sm">No items selected</p>
                    ) : (
                        selectedFuneralItems.map((item) => (
                            <div key={item._id} className="border-b border-gray-200 py-2 flex justify-between items-center">
                                <div className="flex-1">
                                    <div className="text-sm font-medium">{item.name}</div>
                                    <div className="text-xs text-gray-600">{item.description === "" ? "No description" : item.description}</div>
                                    <div className="text-xs text-gray-600">{item.selectedQty} x €{item.price}</div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold">€{item.totalPrice.toFixed(2)}</span>
                                    <button onClick={() => startEditingItem(item)} title="Edit item">
                                        <Edit3 className="text-purple-500 hover:text-purple-700 hover:scale-110" size={14}  />
                                    </button>
                                    <button onClick={() => removeFuneralItem(item._id)} title="Remove item">
                                        <Trash2 className="text-red-400 hover:text-red-600 hover:scale-110" size={14} />
                                    </button>
                                    
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            {/* Total and Actions */}
            <div className="border-t-2 border-gray-300 pt-4 mt-2">
                <div className="flex justify-between items-center text-lg font-bold mb-4">
                    <span>Total:</span>
                    <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={onClearAll}
                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 text-sm"
                    >
                        Clear All
                    </button>
                    <button 
                        onClick={onSave}
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-sm"
                    >
                        {isEditMode ? 'Update Funeral' : 'Save Funeral'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CreateFuneralModal() {
    const { 
        showFuneralModal, 
        setShowFuneralModal, 
        selectedFuneralItems, 
        addFuneralItem, 
        clearFuneralItems,
        isEditMode,
        setIsEditMode,
        viewingFuneral,
        setSelectedFuneralItems,
        editingFuneralData,
        setEditingFuneralData
    } = useFuneralsContext();
    const {inventory } = useInventoryContext();
    const { createFuneral, updateFuneral } = useFuneralsV2();
    const [formData, setFormData] = useState<FuneralFormData>({
        deceasedName: "",
        dateOfDeath: "",
        lastAddress: "",
        clientName: "",
        clientAddress: "",
        clientPhone: "",
        funeralNotes: "",
        selectedItems: [],
        // paymentStatus removed for redesign
    });

    // Populate form data when in edit mode
    useEffect(() => {
        if (isEditMode && editingFuneralData && showFuneralModal) {
            // Extract data from V2 funeralData structure
            setFormData({
                deceasedName: editingFuneralData.deceasedName || "",
                dateOfDeath: editingFuneralData.dateOfDeath || "",
                lastAddress: editingFuneralData.lastAddress || "",
                clientName: editingFuneralData.client?.name || "",
                clientAddress: editingFuneralData.client?.address || "",
                clientPhone: editingFuneralData.client?.phone || "",
                clientEmail: editingFuneralData.client?.email || "",
                funeralNotes: editingFuneralData.funeralNotes || "",
                contactName1: editingFuneralData.contacts?.contactName1 || "",
                phone1: editingFuneralData.contacts?.phone1 || "",
                contactName2: editingFuneralData.contacts?.contactName2 || "",
                phone2: editingFuneralData.contacts?.phone2 || "",
                careOf: editingFuneralData.billing?.careOf || "",
                billingName: editingFuneralData.billing?.name || "",
                billingAddress: editingFuneralData.billing?.address || "",
                fromDate: editingFuneralData.fromDate || "",
                toDate: editingFuneralData.toDate || "",
                invoiceNumber: editingFuneralData.billing?.invoiceNumber || "",
                notes: editingFuneralData.notes || "",
                selectedItems: [],
                // paymentStatus removed for redesign
            });
            
            // selectedFuneralItems should already be populated by the edit handler
        }
    }, [isEditMode, editingFuneralData, showFuneralModal]);

    const infoSections = FUNERAL_TEMPLATE_A.sections.filter((section) => section.name !== "billingDetails");
    const billingSection = FUNERAL_TEMPLATE_A.sections.filter((section) => section.name == "billingDetails");
    
    // Handle product selection
    const handleProductSelect = useCallback((product: InventoryItem) => {
        const newItem: SelectedFuneralItem = {
            ...product,
            selectedQty: 1,
            totalPrice: product.price
        };
        addFuneralItem(newItem);
    }, [addFuneralItem]);


    // Handle form field changes
    const handleFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    // Handle clear all
    const handleClearAll = useCallback(() => {
        clearFuneralItems();
        setFormData({
            deceasedName: "",
            dateOfDeath: "",
            lastAddress: "",
            clientName: "",
            clientAddress: "",
            clientPhone: "",
            funeralNotes: "",
            selectedItems: []
        });
        setIsEditMode(false);
        setEditingFuneralData(null);
    }, [clearFuneralItems, setIsEditMode, setEditingFuneralData]);

    // Handle save funeral
    const handleSave = useCallback(async () => {
        try {
            // Convert selected items to FuneralItem format
            const funeralItems: FuneralItem[] = selectedFuneralItems.map(item => ({
                _id: item._id,
                name: item.name,
                category: item.category,
                type: item.type,
                description: item.description || "",
                qty: item.selectedQty,
                isBillable: item.isBillable,
                price: item.price
            }));

            // Prepare data for V2 API submission
            const submissionDataV2: FuneralDataV2 = {
                deceasedName: formData.deceasedName || '',
                dateOfDeath: formData.dateOfDeath || '',
                lastAddress: formData.lastAddress || '',
                client: {
                    name: formData.clientName || '',
                    address: formData.clientAddress || '',
                    phone: formData.clientPhone || '',
                    email: formData.clientEmail || ''
                },
                billing: {
                    careOf: formData.careOf || '',
                    name: formData.billingName || '',
                    address: formData.billingAddress || '',
                    invoiceNumber: formData.invoiceNumber || ''
                },
                contacts: {
                    contactName1: formData.contactName1 || '',
                    phone1: formData.phone1 || '',
                    contactName2: formData.contactName2 || '',
                    phone2: formData.phone2 || ''
                },
                invoice: {
                    invoiceNumber: formData.invoiceNumber || '',
                    generatedDate: new Date().toISOString(),
                    status: 'Draft',
                    totalAmount: funeralItems.reduce((sum, item) => sum + (item.qty * item.price), 0),
                    lineItems: funeralItems
                },
                fromDate: formData.fromDate || '',
                toDate: formData.toDate || '',
                selectedItems: funeralItems,
                notes: formData.notes || '',
                funeralNotes: formData.funeralNotes || ''
            };

            // Submit funeral data
            
            let result;
            if (isEditMode && viewingFuneral) {
                result = await updateFuneral(viewingFuneral._id, submissionDataV2);
            } else {
                result = await createFuneral(submissionDataV2);
            }
            
            // Check if operation was successful (result can be null due to transformation issues)
            // In V2 integration, a null result might just mean transformation failed but creation succeeded
            // Process result
            
            // Always close modal and clear form after attempting operation
            // The data refresh will update the UI with the latest data
            handleClearAll();
            setShowFuneralModal(false);
            
            if (result) {
                // Operation completed successfully
            } else {
                // Data refreshed
            }
        } catch (error) {
            console.error(isEditMode ? 'Error updating funeral:' : 'Error creating funeral:', error);
        }
    }, [formData, selectedFuneralItems, createFuneral, updateFuneral, isEditMode, viewingFuneral, handleClearAll, setShowFuneralModal]);



    return(
        <div id="modal-container" className={`p-2 flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-100 z-50 shadow-lg rounded-lg w-49/50 h-19/20 flex border ${showFuneralModal ? 'visible' : 'hidden'}`}>
            <div id="modal-header" className="flex justify-between">
                <h1 className="font-bold">{isEditMode ? 'Edit Funeral' : 'Create Funeral'}</h1>
                <button className="boder" onClick={() => {setShowFuneralModal(!showFuneralModal)}}>X</button>
            </div>

            <div id="content-container" className="flex overflow-auto">
                <div id="main-content" className="overflow-auto basis-2/3 h-full gap-0">
                    <div id="info-section" className="flex overflow-y-auto">
                        {infoSections.map((section) => (
                            <SectionContainer key={section._id} heading={section.label} className="w-full">
                                {section.fields.map((field) => (
                                    <FieldElement
                                        key={field._id}
                                        {...field}
                                        value={formData[field.name as keyof FuneralFormData] as string || ""}
                                        onChange={handleFieldChange}
                                    />
                                ))}
                                {section.contactGroups && section.contactGroups?.map((group, index) => (
                                    <div key={index} className="border border-gray-100 rounded p-1">
                                        <h3>{group.label}</h3>
                                        <div className="flex justify-between gap-x-2">
                                            {group.fields?.map((field) => (
                                                <FieldElement
                                                    key={field._id}
                                                    {...field}
                                                    value={formData[field.name as keyof FuneralFormData] as string || ""}
                                                    onChange={handleFieldChange}
                                                /> 
                                            ))}
                                            <button className="p-2 place-items-end hover:font-bold">X</button>
                                        </div>
                                    </div>
                                ))}
                            </SectionContainer>
                        ))}
                    </div>

                    <div id="billing-pos-container" className="col-span-2 overflow-y-auto">
                        <SectionContainer heading="Billing" className="h-full">
                            {billingSection.map((section, index) => (
                                <div key={index} className="flex flex-wrap">
                                    {section.fields.map((field) => (
                                        <FieldElement
                                            key={field._id}
                                            {...field}
                                            value={formData[field.name as keyof FuneralFormData] as string || ""}
                                            onChange={handleFieldChange}
                                        /> 
                                    ))}
                                </div>      
                            ))}

                            {/* Payment Status field removed for redesign */}

                            <ProductSection 
                                products={inventory} 
                                onProductSelect={handleProductSelect}
                                selectedProducts={selectedFuneralItems}
                            />
                        </SectionContainer>
                    </div>
                </div>
                <div id="sidebar" className="sticky basis-1/3 bg-white border-2 border-gray-300 rounded overflow-y-auto p-2">
                    <FuneralSummary 
                        formData={formData}
                        onClearAll={handleClearAll}
                        onSave={handleSave}
                        isEditMode={isEditMode}
                    />
                </div>
            </div>
        </div>
    );
}