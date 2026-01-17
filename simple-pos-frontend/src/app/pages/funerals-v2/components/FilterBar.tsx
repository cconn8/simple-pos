"use client";

import React from 'react';
import { useFuneralsContext } from '@/contexts/FuneralsContext';
import { FUNERAL_TYPES } from '@/types/funeralV2';

// Constants for dropdown options
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Generate years from current year back to 2020, plus next year
const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear + 1; year >= 2020; year--) {
        years.push(year.toString());
    }
    return years;
};

const YEARS = generateYearOptions();

export default function FilterBar() {
    const { filters, updateFilter, clearAllFilters } = useFuneralsContext();

    const handleFilterChange = (key: any, value: string) => {
        updateFilter(key, value);
    };

    // Count active filters for user feedback
    const activeFilterCount = Object.values(filters).filter(value => value !== "").length;

    return (
        <div className="bg-gray-50 p-4 rounded-lg border mb-4">
            <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-sm font-medium text-gray-700 mr-2">Filters:</h3>
                
                {/* Type Filter */}
                <div className="flex items-center gap-1">
                    <label className="text-xs text-gray-600">Type:</label>
                    <select 
                        value={filters.type} 
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs"
                    >
                        <option value="">All Types</option>
                        {FUNERAL_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Date of Death Filters */}
                <div className="flex items-center gap-1">
                    <label className="text-xs text-gray-600">Death Year:</label>
                    <select 
                        value={filters.dateOfDeathYear} 
                        onChange={(e) => handleFilterChange('dateOfDeathYear', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs"
                    >
                        <option value="">All Years</option>
                        {YEARS.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-1">
                    <label className="text-xs text-gray-600">Death Month:</label>
                    <select 
                        value={filters.dateOfDeathMonth} 
                        onChange={(e) => handleFilterChange('dateOfDeathMonth', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs"
                        disabled={!filters.dateOfDeathYear} // Disable if no year selected
                    >
                        <option value="">All Months</option>
                        {MONTHS.map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>

                {/* Commenced Work Filters */}
                <div className="flex items-center gap-1">
                    <label className="text-xs text-gray-600">Commenced Work Year:</label>
                    <select 
                        value={filters.commencedWorkYear} 
                        onChange={(e) => handleFilterChange('commencedWorkYear', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs"
                    >
                        <option value="">All Years</option>
                        {YEARS.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-1">
                    <label className="text-xs text-gray-600">Commenced Work Month:</label>
                    <select 
                        value={filters.commencedWorkMonth} 
                        onChange={(e) => handleFilterChange('commencedWorkMonth', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs"
                        disabled={!filters.commencedWorkYear} // Disable if no year selected
                    >
                        <option value="">All Months</option>
                        {MONTHS.map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>

                {/* Clear Filters Button */}
                {activeFilterCount > 0 && (
                    <button 
                        onClick={clearAllFilters}
                        className="px-3 py-1 bg-red-100 text-red-600 text-xs rounded hover:bg-red-200 transition-colors"
                    >
                        Clear All ({activeFilterCount})
                    </button>
                )}
            </div>
        </div>
    );
}