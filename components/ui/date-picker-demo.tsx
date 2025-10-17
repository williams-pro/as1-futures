"use client"

import { useState } from "react"
import { DatePicker } from "./date-picker"
import { DatePickerEnhanced } from "./date-picker-enhanced"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"

export function DatePickerDemo() {
  const [value1, setValue1] = useState("")
  const [value2, setValue2] = useState("")

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">DatePicker Mejorado - Demo</h2>
        <p className="text-muted-foreground mb-6">
          El DatePicker ahora permite entrada directa de texto además del selector de calendario.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Versión original mejorada */}
        <Card>
          <CardHeader>
            <CardTitle>DatePicker Original (Mejorado)</CardTitle>
            <CardDescription>
              Versión mejorada del DatePicker original con entrada directa de texto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Fecha de nacimiento:</label>
              <DatePicker
                value={value1}
                onChange={setValue1}
                placeholder="YYYY-MM-DD"
                allowClear={true}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p><strong>Características:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Entrada directa de texto</li>
                <li>Validación en tiempo real</li>
                <li>Selector de calendario</li>
                <li>Botón de limpiar</li>
                <li>Indicador de validación</li>
                <li>Soporte para teclado (Enter, Escape)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Versión enhanced */}
        <Card>
          <CardHeader>
            <CardTitle>DatePicker Enhanced</CardTitle>
            <CardDescription>
              Versión alternativa con mejor UX y validación visual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Fecha de nacimiento:</label>
              <DatePickerEnhanced
                value={value2}
                onChange={setValue2}
                placeholder="YYYY-MM-DD"
                allowClear={true}
                showValidation={true}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p><strong>Características adicionales:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Validación visual con colores</li>
                <li>Indicadores de estado más claros</li>
                <li>Mejor feedback visual</li>
                <li>Diseño más compacto</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Valores actuales */}
      <Card>
        <CardHeader>
          <CardTitle>Valores Actuales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <strong>DatePicker Original:</strong> {value1 || "Sin valor"}
            </div>
            <div>
              <strong>DatePicker Enhanced:</strong> {value2 || "Sin valor"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instrucciones de uso */}
      <Card>
        <CardHeader>
          <CardTitle>Instrucciones de Uso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Entrada de Texto:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Escribe directamente en formato YYYY-MM-DD (ej: 2007-04-06)</li>
                <li>El sistema valida automáticamente mientras escribes</li>
                <li>Presiona Enter para confirmar o Escape para cancelar</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Selector de Calendario:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Haz clic en el ícono de calendario para abrir el selector</li>
                <li>Selecciona una fecha y se formateará automáticamente</li>
                <li>El calendario se cierra automáticamente al seleccionar</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Botón de Limpiar:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Aparece cuando hay un valor ingresado</li>
                <li>Limpia el campo completamente</li>
                <li>No aparece cuando el campo está deshabilitado</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
