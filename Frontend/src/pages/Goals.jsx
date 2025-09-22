import { useEffect, useState } from 'react'
import api from '../api/client'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Goals(){
  const [items,setItems] = useState([])
  const [type,setType] = useState('calories')
  const [targetValue,setTarget] = useState(2000)
  const [deadline,setDeadline] = useState(new Date().toISOString().slice(0,10))

  const load = async()=>{
    const { data } = await api.get('/goals')
    setItems(data)
  }

  useEffect(()=>{ load() },[])

  const add = async(e)=>{
    e.preventDefault()
    await api.post('/goals',{ type, targetValue:Number(targetValue), deadline })
    load()
  }

  const updateProgress = async(id)=>{
    await api.put(`/goals/${id}/progress`)
    load()
  }

  const remove = async(id)=>{
    await api.delete(`/goals/${id}`)
    load()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Goals</h2>
      <form onSubmit={add} className="flex flex-wrap gap-3 items-center">
        <select value={type} onChange={e=>setType(e.target.value)} className="rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100">
          <option value="calories">calories</option>
          <option value="sleep">sleep</option>
          <option value="water">water</option>
          <option value="steps">steps</option>
          <option value="custom">custom</option>
        </select>
        <Input type="number" value={targetValue} onChange={e=>setTarget(e.target.value)} placeholder="target" className="max-w-xs" />
        <Input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} className="max-w-xs" />
        <Button type="submit">Add</Button>
      </form>
      <ul className="space-y-2">
        {items.map(g=> (
          <li key={g._id} className="rounded-md border p-3 dark:border-slate-800">
            {g.type}: {g.currentValue}/{g.targetValue} {g.achieved? '✅':''} (deadline {new Date(g.deadline).toLocaleDateString()})
            <Button onClick={()=>updateProgress(g._id)} className="ml-3">Update</Button>
            <Button onClick={()=>remove(g._id)} className="ml-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600">Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
