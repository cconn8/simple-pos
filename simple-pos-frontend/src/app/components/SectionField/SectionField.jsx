import React from "react";


export default function SectionField({field}) {

    return (
        <input 
            key={field.title}
            type={field.type}
            placeholder={field.title}
            className="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
        />
    )
}