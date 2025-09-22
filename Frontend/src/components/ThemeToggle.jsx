import { useEffect, useState } from 'react'

export default function ThemeToggle(){
  const [dark,setDark] = useState(false)

  useEffect(()=>{
    const saved = localStorage.getItem('hh-theme')
    const initial = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(initial)
  },[])

  useEffect(()=>{
    const root = document.documentElement
    if(dark){
      root.classList.add('dark')
      localStorage.setItem('hh-theme','dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('hh-theme','light')
    }
  },[dark])

  return (
    <button onClick={()=>setDark(v=>!v)} aria-label="Toggle theme" className="ml-2 inline-flex items-center rounded-full border px-2 py-1 text-xs bg-white hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">
      {dark ? 'Dark' : 'Light'}
    </button>
  )
}
