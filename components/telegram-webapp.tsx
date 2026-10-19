"use client"

import { useEffect } from "react"

export function TelegramWebAppInit() {
  useEffect(() => {
    const tg = (window as Window & { Telegram?: { WebApp?: { ready: () => void; expand: () => void } } })
      .Telegram?.WebApp
    if (tg) {
      tg.ready()
      tg.expand()
    }
  }, [])
  return null
}
