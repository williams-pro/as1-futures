/**
 * Utilidades para detección de tipo de dispositivo
 */

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

/**
 * Detecta el tipo de dispositivo basado en el user agent y tamaño de pantalla
 * @param userAgent - User agent string del navegador
 * @param screenWidth - Ancho de la pantalla en píxeles
 * @returns Tipo de dispositivo detectado
 */
export function detectDeviceType(userAgent?: string, screenWidth?: number): DeviceType {
  // Si no hay user agent, asumir desktop
  if (!userAgent) {
    return 'desktop'
  }

  // Detectar móviles por user agent
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const isMobile = mobileRegex.test(userAgent)

  // Detectar tablets específicamente
  const tabletRegex = /iPad|Android(?!.*Mobile)|Tablet/i
  const isTablet = tabletRegex.test(userAgent)

  // Si tenemos información de pantalla, usarla como criterio adicional
  if (screenWidth !== undefined) {
    if (screenWidth < 768) {
      return 'mobile'
    } else if (screenWidth < 1024) {
      return 'tablet'
    } else {
      return 'desktop'
    }
  }

  // Fallback a user agent
  if (isTablet) {
    return 'tablet'
  } else if (isMobile) {
    return 'mobile'
  } else {
    return 'desktop'
  }
}

/**
 * Detecta el tipo de dispositivo en el cliente (browser)
 * @returns Tipo de dispositivo detectado
 */
export function detectDeviceTypeClient(): DeviceType {
  if (typeof window === 'undefined') {
    return 'desktop'
  }

  const userAgent = window.navigator.userAgent
  const screenWidth = window.screen.width

  return detectDeviceType(userAgent, screenWidth)
}

/**
 * Hook para detectar el tipo de dispositivo en React
 * @returns Tipo de dispositivo actual
 */
export function useDeviceType(): DeviceType {
  if (typeof window === 'undefined') {
    return 'desktop'
  }

  const [deviceType, setDeviceType] = useState<DeviceType>(() => 
    detectDeviceTypeClient()
  )

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(detectDeviceTypeClient())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return deviceType
}

// Importaciones necesarias para el hook
import { useState, useEffect } from 'react'
