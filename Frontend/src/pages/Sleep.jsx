import { useEffect, useState } from 'react'
import api from '../api/client'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Sleep(){
  const [hours,setHours] = useState(7)
  const [quality,setQuality] = useState('good')
  const [items,setItems] = useState([])
  const [stats,setStats] = useState(null)

  const load = async()=>{
    const [list, s] = await Promise.all([
      api.get('/sleep'),
      api.get('/sleep/stats')
    ])
    setItems(list.data)
    setStats(s.data)
  }

  useEffect(()=>{ load() },[])

  const log = async(e)=>{
    e.preventDefault()
    await api.post('/sleep',{ hoursSlept:Number(hours), sleepQuality: quality })
    setHours(7); setQuality('good')
    load()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Sleep</h2>
      <form onSubmit={log} className="flex flex-wrap gap-3 items-center">
        <Input type="number" value={hours} onChange={e=>setHours(e.target.value)} placeholder="hours" className="max-w-xs" />
        <select value={quality} onChange={e=>setQuality(e.target.value)} className="rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100">
          <option value="very_poor">very_poor</option>
          <option value="poor">poor</option>
          <option value="fair">fair</option>
          <option value="good">good</option>
          <option value="very_good">very_good</option>
        </select>
        <Button type="submit">Log</Button>
      </form>
      {stats && <div className="mb-3">Avg: <b>{stats.avgHours?.toFixed?.(2)||0}</b> Total nights: <b>{stats.totalNights||0}</b></div>}
      <ul className="space-y-1">
        {items.map(i=> (
          <li key={i._id} className="rounded-md border p-2 dark:border-slate-800">{new Date(i.date).toLocaleDateString()}: {i.hoursSlept}h ({i.sleepQuality})</li>
        ))}
      </ul>
    </div>
  )
}
