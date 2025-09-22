import { useEffect, useState } from 'react'
import api from '../api/client'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Challenges(){
  const [mine,setMine] = useState([])
  const [title,setTitle] = useState('September Steps')
  const [type,setType] = useState('steps')
  const [target,setTarget] = useState(10000)
  const [startDate,setStart] = useState(new Date().toISOString().slice(0,10))
  const [endDate,setEnd] = useState(new Date(Date.now()+7*86400000).toISOString().slice(0,10))
  const [leaderboard,setLeaderboard] = useState([])

  const load = async()=>{
    const { data } = await api.get('/challenges/mine')
    setMine(data)
  }

  useEffect(()=>{ load() },[])

  const create = async(e)=>{
    e.preventDefault()
    const payload = { title, type, target:Number(target), startDate, endDate, isPublic:true }
    const { data } = await api.post('/challenges', payload)
    setLeaderboard([])
    load()
  }

  const join = async(id)=>{ await api.post(`/challenges/${id}/join`); load() }
  const progress = async(id)=>{ await api.post(`/challenges/${id}/progress`, { delta: 1000 }); load() }
  const showLeaderboard = async(id)=>{ const { data } = await api.get(`/challenges/${id}/leaderboard`); setLeaderboard(data) }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Challenges</h2>
      <form onSubmit={create} className="flex flex-wrap gap-3 items-center">
        <Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="title" className="max-w-xs" />
        <select value={type} onChange={e=>setType(e.target.value)} className="rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100">
          <option value="steps">steps</option>
          <option value="calories">calories</option>
          <option value="sleepHours">sleepHours</option>
          <option value="custom">custom</option>
        </select>
        <Input type="number" value={target} onChange={e=>setTarget(e.target.value)} placeholder="target" className="max-w-xs" />
        <Input type="date" value={startDate} onChange={e=>setStart(e.target.value)} className="max-w-xs" />
        <Input type="date" value={endDate} onChange={e=>setEnd(e.target.value)} className="max-w-xs" />
        <Button type="submit">Create</Button>
      </form>

      <h3 className="text-xl font-semibold">My Challenges</h3>
      <ul className="space-y-2">
        {mine.map(c=> (
          <li key={c._id} className="rounded-md border p-3 dark:border-slate-800">
            {c.title} ({c.type}) target {c.target}
            <Button onClick={()=>join(c._id)} className="ml-3">Join</Button>
            <Button onClick={()=>progress(c._id)} className="ml-2">+Progress</Button>
            <Button onClick={()=>showLeaderboard(c._id)} className="ml-2">Leaderboard</Button>
          </li>
        ))}
      </ul>

      {leaderboard.length>0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Leaderboard</h3>
          <ol className="list-decimal ml-5 space-y-1">
            {leaderboard.map(r=> (
              <li key={r.userId}>
                {r.user?.name || r.userId}: {r.progress} (pts {r.points}) {r.completed? '🏆':''}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
