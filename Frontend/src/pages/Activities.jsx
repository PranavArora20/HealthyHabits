import { useEffect, useState } from 'react'
import api from '../api/client'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Activities(){
  const [items,setItems] = useState([])
  const [type,setType] = useState('run')
  const [duration,setDuration] = useState(30)
  const [caloriesBurned,setCalories] = useState(200)

  const load = async()=>{
    const { data } = await api.get('/activities')
    setItems(data)
  }

  useEffect(()=>{ load() },[])

  const add = async(e)=>{
    e.preventDefault()
    await api.post('/activities',{ type, duration:Number(duration), caloriesBurned:Number(caloriesBurned) })
    setDuration(30); setCalories(200); setType('run')
    load()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Activities</h2>
      <form onSubmit={add} className="flex flex-wrap gap-3 items-center">
        <Input value={type} onChange={e=>setType(e.target.value)} placeholder="type" className="max-w-xs" />
        <Input value={duration} onChange={e=>setDuration(e.target.value)} placeholder="duration" type="number" className="max-w-xs" />
        <Input value={caloriesBurned} onChange={e=>setCalories(e.target.value)} placeholder="calories" type="number" className="max-w-xs" />
        <Button type="submit">Add</Button>
      </form>
      <ul className="space-y-1">
        {items.map(i=> (
          <li key={i._id} className="rounded-md border p-2 dark:border-slate-800">{i.type} - {i.duration}m - {i.caloriesBurned} cal</li>
        ))}
      </ul>
    </div>
  )
}
