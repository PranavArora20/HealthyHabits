import { useState } from 'react'
import api from '../api/client'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')
  const nav = useNavigate()

  const onSubmit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    setError('')
    try{
      const { data } = await api.post('/auth/login',{ email, password })
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      nav('/')
    }catch(err){
      setError(err.response?.data?.message || 'Login failed')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid place-items-center">
      <Card className="w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="flex justify-end">
            <Button disabled={loading} type="submit">{loading?'...':'Login'}</Button>
          </div>
        </form>
        <p className="text-sm text-gray-600 mt-4">New here? <Link to="/register" className="text-brand-600 hover:underline">Register</Link></p>
      </Card>
    </div>
  )
}
