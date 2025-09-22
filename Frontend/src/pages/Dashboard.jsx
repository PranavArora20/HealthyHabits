import { useEffect, useState } from 'react'
import api from '../api/client'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function Dashboard(){
  const [summary,setSummary] = useState({ totalCalories:0, totalDuration:0, activityCount:0 })
  const [sleepStats,setSleepStats] = useState(null)

  useEffect(()=>{
    let mounted = true
    ;(async()=>{
      try{
        const [activitiesRes, sleepRes] = await Promise.all([
          api.get('/activities'),
          api.get('/sleep/stats')
        ])
        const acts = activitiesRes.data || []
        const totalCalories = acts.reduce((s,a)=>s+(a.caloriesBurned||0),0)
        const totalDuration = acts.reduce((s,a)=>s+(a.duration||0),0)
        if(mounted){
          setSummary({ totalCalories, totalDuration, activityCount: acts.length })
          setSleepStats(sleepRes.data)
        }
      }catch(e){
        // ignore
      }
    })()
    return ()=>{mounted=false}
  },[])

  const chartData = [
    { name:'Calories', value: summary.totalCalories },
    { name:'Duration', value: summary.totalDuration },
    { name:'Activities', value: summary.activityCount },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-lg border p-4 dark:border-slate-800">Total Calories: <b>{summary.totalCalories}</b></div>
        <div className="rounded-lg border p-4 dark:border-slate-800">Total Duration: <b>{summary.totalDuration}</b> min</div>
        <div className="rounded-lg border p-4 dark:border-slate-800">Activities: <b>{summary.activityCount}</b></div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
            <XAxis dataKey="name" stroke="var(--hh-chart)" tick={{ fill: 'var(--hh-chart)' }} />
            <YAxis stroke="var(--hh-chart)" tick={{ fill: 'var(--hh-chart)' }} />
            <Tooltip contentStyle={{ backgroundColor: 'rgb(15 23 42 / 0.9)', border:'none', color:'#fff' }} wrapperStyle={{ color:'#fff' }} />
            <Line type="monotone" dataKey="value" stroke="#60a5fa" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {sleepStats && (
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">Sleep Stats</h3>
          <div>Avg Hours: <b>{sleepStats.avgHours?.toFixed?.(2) || 0}</b></div>
          <div>Total Nights: <b>{sleepStats.totalNights || 0}</b></div>
        </div>
      )}
    </div>
  )
}
