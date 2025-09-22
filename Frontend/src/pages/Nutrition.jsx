import { useEffect, useState } from 'react'
import api from '../api/client'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Nutrition(){
  const [mealName,setMealName] = useState('1 cup rice, 100g chicken')
  const [meals,setMeals] = useState([])

  const load = async()=>{
    const { data } = await api.get('/nutrition')
    setMeals(data)
  }

  useEffect(()=>{ load() },[])

  const log = async(e)=>{
    e.preventDefault()
    await api.post('/nutrition/log',{ mealName })
    setMealName('')
    load()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Nutrition</h2>
      <form onSubmit={log} className="flex gap-3">
        <Input value={mealName} onChange={e=>setMealName(e.target.value)} placeholder="e.g. 1 cup rice, 100g chicken" className="flex-1" />
        <Button type="submit">Log</Button>
      </form>
      <ul className="space-y-2">
        {meals.map(m=> (
          <li key={m._id} className="rounded-md border p-3 dark:border-slate-800">
            <div className="font-medium">{m.mealName}</div>
            <div className="text-sm opacity-80">{Math.round(m.calories)} kcal · P {Math.round(m.macros?.protein||0)} · C {Math.round(m.macros?.carbs||0)} · F {Math.round(m.macros?.fat||0)}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
