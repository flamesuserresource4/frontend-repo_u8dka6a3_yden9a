import AddItemForm from './components/AddItemForm'
import Timeline from './components/Timeline'
import Notifier from './components/Notifier'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-6 max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Daily Planner</h1>
          <p className="text-blue-200 mt-1">Plan your day, see your schedule on a timeline, and get notifications.</p>
        </header>

        <div className="space-y-6">
          <AddItemForm onCreated={() => window.dispatchEvent(new CustomEvent('refresh-items'))} />
          <Timeline />
        </div>

        <Notifier />
      </div>
    </div>
  )
}

export default App
