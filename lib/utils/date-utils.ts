import { format, parseISO, isValid, formatISO } from 'date-fns'

/**
 * Convierte una fecha a formato YYYY-MM-DD para inputs de tipo date
 * @param dateString - Fecha en cualquier formato válido
 * @returns Fecha en formato YYYY-MM-DD o string vacío si es inválida
 */
export function formatDateForInput(dateString: string): string {
  if (!dateString) return ''
  
  try {
    // Si ya está en formato YYYY-MM-DD, devolverlo
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString
    }
    
    // Parsear la fecha y convertir a YYYY-MM-DD
    const date = parseISO(dateString)
    
    if (!isValid(date)) {
      console.warn('Invalid date string:', dateString)
      return ''
    }
    
    return format(date, 'yyyy-MM-dd')
  } catch (error) {
    console.warn('Error formatting date:', error)
    return ''
  }
}

/**
 * Convierte una fecha de input a formato de base de datos
 * @param inputDate - Fecha del input en formato YYYY-MM-DD
 * @returns Fecha en formato ISO string para la base de datos
 */
export function formatDateForDatabase(inputDate: string): string {
  if (!inputDate) return ''
  
  try {
    const date = parseISO(inputDate)
    return isValid(date) ? formatISO(date, { representation: 'date' }) : ''
  } catch (error) {
    console.warn('Error formatting date for database:', error)
    return ''
  }
}

/**
 * Convierte una fecha a objeto Date para el componente Calendar
 * @param dateString - Fecha en formato string
 * @returns Objeto Date o undefined si es inválida
 */
export function parseDateForCalendar(dateString: string): Date | undefined {
  if (!dateString) return undefined
  
  try {
    const date = parseISO(dateString)
    return isValid(date) ? date : undefined
  } catch (error) {
    console.warn('Error parsing date for calendar:', error)
    return undefined
  }
}

/**
 * Convierte un objeto Date del Calendar a formato de base de datos
 * @param date - Objeto Date del Calendar
 * @returns Fecha en formato YYYY-MM-DD para la base de datos
 */
export function formatCalendarDateForDatabase(date: Date | undefined): string {
  if (!date) return ''
  
  try {
    return isValid(date) ? formatISO(date, { representation: 'date' }) : ''
  } catch (error) {
    console.warn('Error formatting calendar date for database:', error)
    return ''
  }
}

/**
 * Valida si una fecha es válida
 * @param dateString - Fecha en formato string
 * @returns true si la fecha es válida
 */
export function isValidDateString(dateString: string): boolean {
  if (!dateString) return false
  
  try {
    const date = parseISO(dateString)
    return isValid(date)
  } catch {
    return false
  }
}

/**
 * Formatea una fecha de la base de datos (YYYY-MM-DD) para mostrar en la UI de manera legible.
 * @param dateString - Fecha en formato YYYY-MM-DD de la base de datos
 * @returns Fecha formateada para mostrar (ej: "April 6, 2007")
 */
export function formatDateForDisplay(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    
    if (!isValid(date)) {
      console.warn('Invalid date string for display:', dateString);
      return dateString; // Devolver la fecha original si no se puede parsear
    }
    
    return format(date, 'MMMM d, yyyy');
  } catch (error) {
    console.warn('Error formatting date for display:', error);
    return dateString; // Devolver la fecha original si hay error
  }
}
