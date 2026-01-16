/**
 * Formats a date string to DD-MONTH-YYYY format (e.g., "21 Sept 2025")
 * @param dateString - Date string in ISO format or any valid date format
 * @returns Formatted date string or '-' if invalid
 */
export function formatDateDisplay(dateString: string | null | undefined): string {
  if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') {
    return '-';
  }

  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '-';
    }

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  } catch (error) {
    return '-';
  }
}