import { useEffect, useRef, useState } from 'react'

const requestPermission = async () => {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission !== 'denied') {
    const p = await Notification.requestPermission()
    return p === 'granted'
  }
  return false
}

export default function Notifier() {
  const [enabled, setEnabled] = useState(false)
  const timerRef = useRef(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    requestPermission().then(setEnabled)
  }, [])

  const poll = async () => {
    try {
      const res = await fetch(`${baseUrl}/items/upcoming?limit=10`)
      if (!res.ok) return
      const items = await res.json()
      const now = Date.now()
      items.forEach(async (it) => {
        if (!it.notify_at) return
        const ts = new Date(it.notify_at).getTime()
        // Trigger if within next minute
        if (ts <= now + 60_000 && ts >= now - 60_000) {
          if (enabled) {
            const body = [
              it.start_time ? `Time: ${it.start_time.slice(0,5)}` : null,
              it.notes ? `Notes: ${it.notes}` : null
            ].filter(Boolean).join('\n')
            new Notification(it.title, { body })
          }
          // Mark as notified to avoid duplicates
          await fetch(`${baseUrl}/items/${it.id}/notified`, { method: 'POST' })
        }
      })
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    timerRef.current = setInterval(poll, 15000) // every 15s
    return () => clearInterval(timerRef.current)
  }, [enabled])

  return null
}
