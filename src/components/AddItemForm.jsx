import { useState } from 'react'

const initialForm = () => ({
  title: '',
  notes: '',
  day: new Date().toISOString().slice(0,10),
  start_time: '',
  end_time: '',
  notify_at: '',
  priority: 'medium',
  tags: ''
})

export default function AddItemForm({ onCreated }) {
  const [form, setForm] = useState(initialForm())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const toPayload = () => {
    const payload = {
      title: form.title.trim(),
      notes: form.notes.trim() || undefined,
      day: form.day,
      start_time: form.start_time || undefined,
      end_time: form.end_time || undefined,
      notify_at: form.notify_at ? new Date(form.notify_at).toISOString() : undefined,
      priority: form.priority,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    }
    return payload
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title) { setError('Please enter a title'); return }
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toPayload())
      })
      if (!res.ok) throw new Error(`Failed to create item (${res.status})`)
      setForm(initialForm())
      onCreated && onCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 grid grid-cols-1 md:grid-cols-6 gap-3">
      <input name="title" value={form.title} onChange={handleChange} placeholder="Add a task or event..." className="md:col-span-2 px-3 py-2 rounded-lg bg-slate-900/70 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />

      <input type="date" name="day" value={form.day} onChange={handleChange} className="px-3 py-2 rounded-lg bg-slate-900/70 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />

      <input type="time" name="start_time" value={form.start_time} onChange={handleChange} className="px-3 py-2 rounded-lg bg-slate-900/70 text-white border border-slate-700" />
      <input type="time" name="end_time" value={form.end_time} onChange={handleChange} className="px-3 py-2 rounded-lg bg-slate-900/70 text-white border border-slate-700" />

      <input type="datetime-local" name="notify_at" value={form.notify_at} onChange={handleChange} className="px-3 py-2 rounded-lg bg-slate-900/70 text-white border border-slate-700" />

      <div className="md:col-span-3 flex gap-2">
        <select name="priority" value={form.priority} onChange={handleChange} className="px-3 py-2 rounded-lg bg-slate-900/70 text-white border border-slate-700">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input name="tags" value={form.tags} onChange={handleChange} placeholder="tags (comma separated)" className="flex-1 px-3 py-2 rounded-lg bg-slate-900/70 text-white placeholder-slate-400 border border-slate-700" />
      </div>

      <input name="notes" value={form.notes} onChange={handleChange} placeholder="Notes (optional)" className="md:col-span-4 px-3 py-2 rounded-lg bg-slate-900/70 text-white placeholder-slate-400 border border-slate-700" />

      <div className="md:col-span-2 flex items-center gap-3 justify-end">
        {error && <span className="text-red-400 text-sm">{error}</span>}
        <button disabled={loading} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50">{loading ? 'Adding...' : 'Add Item'}</button>
      </div>
    </form>
  )
}
