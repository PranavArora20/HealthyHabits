import { useEffect, useState } from 'react'
import api from '../api/client'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Habits(){
  const [items,setItems] = useState([])
  const [name,setName] = useState('Drink water')
  const [frequency,setFrequency] = useState('daily')
  const [target,setTarget] = useState(1)
  const [reminderTime,setReminderTime] = useState('08:00')

  const load = async()=>{
    const { data } = await api.get('/habits')
    setItems(data)
  }

  useEffect(()=>{ load() },[])

  const add = async(e)=>{
    e.preventDefault()
    await api.post('/habits',{ name, frequency, target:Number(target), reminderTime })
    load()
  }

  const mark = async(id)=>{
    await api.post(`/habits/${id}/mark`)
    load()
  }

  const remove = async(id)=>{
    await api.delete(`/habits/${id}`)
    load()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Habits</h2>
      <form onSubmit={add} className="flex flex-wrap gap-3 items-center">
        <Input value={name} onChange={e=>setName(e.target.value)} placeholder="name" className="max-w-xs" />
        <select value={frequency} onChange={e=>setFrequency(e.target.value)} className="rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100">
          <option value="daily">daily</option>
          <option value="weekly">weekly</option>
        </select>
        <Input type="number" value={target} onChange={e=>setTarget(e.target.value)} placeholder="target" className="max-w-xs" />
        <Input value={reminderTime} onChange={e=>setReminderTime(e.target.value)} placeholder="HH:mm" className="max-w-xs" />
        <Button type="submit">Add</Button>
      </form>
      <ul className="space-y-2">
        {items.map(h=> (
          <li key={h._id} className="rounded-md border p-3 dark:border-slate-800">
            {h.name} ({h.frequency}) — streak: <b>{h.streak}</b>
            <Button onClick={()=>mark(h._id)} className="ml-3">Mark</Button>
            <Button onClick={()=>remove(h._id)} className="ml-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600">Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
