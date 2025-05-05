import React from "react";

// SectionField captures the container'

export default function SectionField({field}) {

    return (
        <input 
            key={field.title}
            type={field.type}
            placeholder={field.title}
        />
    )
}