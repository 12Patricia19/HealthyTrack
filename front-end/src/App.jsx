import { useState } from 'react'
import Users from './components/Users'
import DailyHabits from './components/DailyHabits'
import HabitNotes from './components/HabitNotes'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('users')

  return (
    <div className="app">
      <header className="header">
        <h1>🏃‍♂️ HealthyTrack</h1>
        <p>Seguimiento de hábitos saludables</p>
      </header>

      <nav className="nav">
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          👤 Usuarios
        </button>
        <button 
          className={activeTab === 'habits' ? 'active' : ''} 
          onClick={() => setActiveTab('habits')}
        >
          📊 Hábitos Diarios
        </button>
        <button 
          className={activeTab === 'notes' ? 'active' : ''} 
          onClick={() => setActiveTab('notes')}
        >
          📝 Notas de Hábitos
        </button>
      </nav>

      <main className="main">
        {activeTab === 'users' && <Users />}
        {activeTab === 'habits' && <DailyHabits />}
        {activeTab === 'notes' && <HabitNotes />}
      </main>

      <footer className="footer">
        <p>HealthyTrack © 2026</p>
      </footer>
    </div>
  )
}

export default App
