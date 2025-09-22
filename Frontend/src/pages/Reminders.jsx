import { useEffect, useState } from 'react'
import api from '../api/client'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Reminders(){
  const [items,setItems] = useState([])
  const [title,setTitle] = useState('Drink Water')
  const [type,setType] = useState('water')
  const [time,setTime] = useState('09:00')

  const load = async()=>{
    const { data } = await api.get('/reminders')
    setItems(data)
  }

  useEffect(()=>{ load() },[])

  const add = async(e)=>{
    e.preventDefault()
    await api.post('/reminders',{ title, type, time })
    load()
  }

  const toggle = async(r)=>{ await api.put(`/reminders/${r._id}`,{ enabled: !r.enabled }); load() }
  const remove = async(id)=>{ await api.delete(`/reminders/${id}`); load() }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Reminders</h2>
      <form onSubmit={add} className="flex flex-wrap gap-3 items-center">
        <Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="title" className="max-w-xs" />
        <select value={type} onChange={e=>setType(e.target.value)} className="rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100">
          <option value="workout">workout</option>
          <option value="meal">meal</option>
          <option value="water">water</option>
          <option value="sleep">sleep</option>
          <option value="habit">habit</option>
          <option value="custom">custom</option>
        </select>
        <Input value={time} onChange={e=>setTime(e.target.value)} placeholder="HH:mm" className="max-w-xs" />
        <Button type="submit">Add</Button>
      </form>
      <ul className="space-y-2">
        {items.map(r=> (
          <li key={r._id} className="rounded-md border p-3 dark:border-slate-800">
            {r.title} ({r.type}) at {r.time} — {r.enabled? 'On':'Off'}
            <Button onClick={()=>toggle(r)} className="ml-3">{r.enabled? 'Disable':'Enable'}</Button>
            <Button onClick={()=>remove(r._id)} className="ml-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600">Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
