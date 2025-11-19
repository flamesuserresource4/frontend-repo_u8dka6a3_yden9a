import { useEffect, useState, useMemo } from 'react'

export default function Timeline() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const todayStr = useMemo(() => new Date().toISOString().slice(0,10), [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/items?day=${todayStr}&include_completed=true`)
      const data = await res.json()
      setItems(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Today's Timeline</h3>
        <button onClick={fetchItems} className="text-sm text-blue-300 hover:text-blue-200">Refresh</button>
      </div>
      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-slate-400">No items yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.sort((a,b) => (a.start_time||'') > (b.start_time||'') ? 1 : -1).map(item => (
            <li key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-700">
              <div className="w-20 text-xs text-slate-300">
                <div>{item.start_time ? item.start_time.slice(0,5) : '--:--'}</div>
                <div>{item.end_time ? item.end_time.slice(0,5) : ''}</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${item.completed ? 'bg-green-400' : 'bg-blue-400'}`}></span>
                  <p className="text-white font-medium">{item.title}</p>
                  {item.priority && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${item.priority==='high'?'border-red-500 text-red-300':item.priority==='medium'?'border-yellow-500 text-yellow-300':'border-slate-500 text-slate-300'}`}>{item.priority}</span>
                  )}
                </div>
                {item.notes && <p className="text-slate-300 text-sm mt-1">{item.notes}</p>}
                {item.tags && item.tags.length>0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.map((t,i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-xs text-slate-400 w-36">
                {item.notify_at ? `Notify: ${new Date(item.notify_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}` : 'No notification'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
