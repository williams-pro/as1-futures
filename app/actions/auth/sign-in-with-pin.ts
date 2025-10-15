"use server"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { PIN_REGEX } from "@/app/(root)/_constants/auth.constants"
import { encodePin } from "@/lib/pin-utils"

const PinAuthSchema = z.object({
  email: z.string().email("Email inválido"),
  pin: z.string().regex(PIN_REGEX, "PIN debe ser exactamente 4 dígitos"),
})
export async function signInWithPin(formData: FormData) {
  const email = formData.get("email") as string
  const pin = formData.get("pin") as string

  if (!email || !pin || !/^\d{4}$/.test(pin)) {
    return { success: false, error: "Email o PIN inválido" }
  }

  const supabase = await createServerClient()

  const { data: scout, error: scoutError } = await supabase
    .from("scouts")
    .select("id, is_active, role")
    .eq("email", email)
    .single()

  if (scoutError || !scout) {
    return { success: false, error: "Email o PIN incorrecto" }
  }

  if (!scout.is_active) {
    return { success: false, error: "Email o PIN incorrecto" }
  }

  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password: encodePin(pin),
  })

  if (authError) {
    return { success: false, error: "Email o PIN incorrecto" }
  }

  revalidatePath("/", "layout")
  redirect("/teams")
}

