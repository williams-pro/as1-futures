"use client"

import * as React from "react"
import { format, parseISO, isValid as isValidDate } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatDateForInput, parseDateForCalendar, formatCalendarDateForDatabase, isValidDateString } from "@/lib/utils/date-utils"

interface DatePickerEnhancedProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  allowClear?: boolean
  showValidation?: boolean
}

export function DatePickerEnhanced({
  value,
  onChange,
  placeholder = "YYYY-MM-DD",
  disabled = false,
  className,
  allowClear = true,
  showValidation = true
}: DatePickerEnhancedProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(value || '')
  const [isInputFocused, setIsInputFocused] = React.useState(false)
  
  // Sincronizar inputValue con value prop
  React.useEffect(() => {
    setInputValue(value || '')
  }, [value])
  
  // Convertir el valor string a Date para el Calendar
  const selectedDate = React.useMemo(() => {
    return parseDateForCalendar(value || '')
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    
    // Validar en tiempo real
    if (newValue.length === 10) { // YYYY-MM-DD completo
      if (isValidDateString(newValue)) {
        onChange?.(newValue)
      }
    } else if (newValue.length === 0) {
      onChange?.('')
    }
  }

  const handleInputBlur = () => {
    setIsInputFocused(false)
    
    // Al perder el foco, validar y formatear
    if (inputValue) {
      if (isValidDateString(inputValue)) {
        onChange?.(inputValue)
      } else {
        // Intentar parsear formatos alternativos
        try {
          const date = parseISO(inputValue)
          if (isValidDate(date)) {
            const formattedDate = format(date, 'yyyy-MM-dd')
            setInputValue(formattedDate)
            onChange?.(formattedDate)
          } else {
            setInputValue(value || '')
          }
        } catch {
          setInputValue(value || '')
        }
      }
    }
  }

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = formatCalendarDateForDatabase(date)
      setInputValue(formattedDate)
      onChange?.(formattedDate)
      setOpen(false)
    }
  }

  const handleClear = () => {
    setInputValue('')
    onChange?.('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur()
    }
    if (e.key === 'Escape') {
      setInputValue(value || '')
      setIsInputFocused(false)
    }
  }

  const isValid = inputValue ? isValidDateString(inputValue) : true
  const isEmpty = !inputValue

  return (
    <div className={cn("space-y-1", className)}>
      <div className="relative">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => setIsInputFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "pr-16",
            !isEmpty && !isValid && "border-red-500 focus-visible:ring-red-500",
            !isEmpty && isValid && "border-green-500 focus-visible:ring-green-500"
          )}
        />
        
        {/* Botones de acción */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {allowClear && inputValue && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
              onClick={handleClear}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                disabled={disabled}
              >
                <CalendarIcon className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleCalendarSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Indicador de validación */}
      {showValidation && inputValue && !isInputFocused && (
        <div className="text-xs">
          {isValid ? (
            <span className="text-green-600 flex items-center gap-1">
              <span className="w-1 h-1 bg-green-600 rounded-full"></span>
              Fecha válida
            </span>
          ) : (
            <span className="text-red-600 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-600 rounded-full"></span>
              Formato inválido (use YYYY-MM-DD)
            </span>
          )}
        </div>
      )}
    </div>
  )
}
