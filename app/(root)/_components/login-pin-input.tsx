"use client"

import type React from "react"
import { useState, forwardRef } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Key, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { LOGIN_TEXTS } from "../_constants"

interface LoginPinInputProps {
  error?: string
  isPending: boolean
}

export const LoginPinInput = forwardRef<HTMLInputElement, LoginPinInputProps>(({ 
  error, 
  isPending, 
  ...props 
}, ref) => {
  const [isPinVisible, setIsPinVisible] = useState(false)

  const togglePinVisibility = () => {
    setIsPinVisible(!isPinVisible)
  }

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (/^\d*$/.test(value) && value.length <= 4) {
      // React Hook Form manejará el valor
      e.target.value = value
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ["Backspace", "Tab", "Escape", "Enter", "Delete", "ArrowLeft", "ArrowRight", "Home", "End"]

    const isCtrlCmd = e.ctrlKey || e.metaKey
    const isSelectAll = isCtrlCmd && e.key === "a"
    const isCopy = isCtrlCmd && e.key === "c"
    const isPaste = isCtrlCmd && e.key === "v"
    const isCut = isCtrlCmd && e.key === "x"

    if (allowedKeys.includes(e.key) || isSelectAll || isCopy || isPaste || isCut) {
      return
    }

    if (!/^\d$/.test(e.key)) {
      e.preventDefault()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")
    const numericOnly = pastedData.replace(/\D/g, "").slice(0, 4)
    // React Hook Form manejará el valor
    if (ref && 'current' in ref && ref.current) {
      ref.current.value = numericOnly
      ref.current.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="pin" className="text-sm font-medium text-gray-700">
        {LOGIN_TEXTS.PIN_INPUT.LABEL}
      </Label>
      <div className="relative">
        <Key
          className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400",
            isPending && "text-gray-300",
          )}
        />
        <Input
          ref={ref}
          id="pin"
          type={isPinVisible ? "text" : "password"}
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={handlePinChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={LOGIN_TEXTS.PIN_INPUT.PLACEHOLDER}
          disabled={isPending}
          aria-label={LOGIN_TEXTS.PIN_INPUT.ARIA_LABEL}
          aria-invalid={!!error}
          aria-describedby="pin-description"
          className={cn(
            "pl-10 pr-12 h-12 text-center text-lg font-mono tracking-widest",
            "border-gray-300 focus:border-as1-gold focus:ring-as1-gold",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            isPending && "bg-gray-50 cursor-not-allowed",
          )}
          maxLength={4}
          autoComplete="off"
          {...props}
        />
        <button
          type="button"
          onClick={togglePinVisibility}
          disabled={isPending}
          className={cn(
            "absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400",
            "hover:text-gray-600 transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-as1-gold/20 focus:ring-offset-1 rounded",
            isPending && "text-gray-300 cursor-not-allowed",
            !isPending && "cursor-pointer"
          )}
          aria-label={isPinVisible ? "Hide PIN" : "Show PIN"}
        >
          {isPinVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      <p id="pin-description" className="text-xs text-gray-500">
        {LOGIN_TEXTS.PIN_INPUT.DESCRIPTION}
      </p>
    </div>
  )
})

LoginPinInput.displayName = "LoginPinInput"
