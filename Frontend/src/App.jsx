import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Activities from './pages/Activities.jsx'
import Nutrition from './pages/Nutrition.jsx'
import Sleep from './pages/Sleep.jsx'
import Goals from './pages/Goals.jsx'
import Habits from './pages/Habits.jsx'
import Challenges from './pages/Challenges.jsx'
import Reminders from './pages/Reminders.jsx'
import Community from './pages/Community.jsx'
import Layout from './components/Layout.jsx'
import { useEffect, useState } from 'react'

function isAuthed() {
  return !!localStorage.getItem('accessToken')
}

function PrivateRoute({ children }) {
  return isAuthed() ? children : <Navigate to="/login" />
}

function WelcomeSplash(){
  const [show,setShow] = useState(false)
  useEffect(()=>{
    const justLoggedIn = sessionStorage.getItem('hh-welcomed') !== 'yes' && isAuthed()
    if(justLoggedIn){
      setShow(true)
      sessionStorage.setItem('hh-welcomed','yes')
      const t = setTimeout(()=>setShow(false), 1800)
      return ()=>clearTimeout(t)
    }
  },[])
  if(!show) return null
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur">
      <div className="text-2xl md:text-3xl font-semibold animate-fade-in-up text-brand-700 dark:text-brand-300">Welcome to HealthyHabits</div>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <WelcomeSplash />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/activities" element={<PrivateRoute><Activities /></PrivateRoute>} />
        <Route path="/nutrition" element={<PrivateRoute><Nutrition /></PrivateRoute>} />
        <Route path="/sleep" element={<PrivateRoute><Sleep /></PrivateRoute>} />
        <Route path="/goals" element={<PrivateRoute><Goals /></PrivateRoute>} />
        <Route path="/habits" element={<PrivateRoute><Habits /></PrivateRoute>} />
        <Route path="/challenges" element={<PrivateRoute><Challenges /></PrivateRoute>} />
        <Route path="/reminders" element={<PrivateRoute><Reminders /></PrivateRoute>} />
        <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
      </Routes>
    </Layout>
  )
}
