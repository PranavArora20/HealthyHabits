import { useEffect, useState } from 'react'
import api from '../api/client'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Community(){
  const [groups,setGroups] = useState([])
  const [name,setName] = useState('Runners Club')
  const [description,setDescription] = useState('Let\'s run together!')
  const [activeGroup,setActiveGroup] = useState(null)
  const [posts,setPosts] = useState([])
  const [text,setText] = useState('Great job today!')

  const loadGroups = async()=>{ const { data } = await api.get('/community/groups'); setGroups(data) }
  const loadPosts = async(id)=>{ const { data } = await api.get(`/community/groups/${id}/posts`); setPosts(data) }

  useEffect(()=>{ loadGroups() },[])

  const createGroup = async(e)=>{ e.preventDefault(); await api.post('/community/groups',{ name, description, isPublic:true }); loadGroups() }
  const join = async(id)=>{ await api.post(`/community/groups/${id}/join`); setActiveGroup(id); loadPosts(id) }
  const post = async(e)=>{ e.preventDefault(); await api.post('/community/posts',{ groupId: activeGroup, text }); loadPosts(activeGroup) }
  const like = async(id)=>{ await api.post(`/community/posts/${id}/like`); loadPosts(activeGroup) }
  const comment = async(id)=>{ const content = prompt('Comment:'); if(!content) return; await api.post(`/community/posts/${id}/comment`, { text: content }); loadPosts(activeGroup) }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Community</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <form onSubmit={createGroup} className="flex flex-wrap gap-3 mb-3">
            <Input value={name} onChange={e=>setName(e.target.value)} placeholder="group name" className="max-w-xs" />
            <Input value={description} onChange={e=>setDescription(e.target.value)} placeholder="description" className="max-w-sm" />
            <Button type="submit">Create</Button>
          </form>
          <ul className="space-y-1">
            {groups.map(g=> (
              <li key={g._id} className="rounded-md border p-2 dark:border-slate-800 flex items-center justify-between">
                <span>{g.name}</span>
                <Button onClick={()=>join(g._id)}>Join</Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold">Posts</h3>
          {activeGroup ? (
            <>
              <form onSubmit={post} className="flex gap-3 mb-3">
                <Input value={text} onChange={e=>setText(e.target.value)} placeholder="share something" className="flex-1" />
                <Button type="submit">Post</Button>
              </form>
              <ul className="space-y-2">
                {posts.map(p=> (
                  <li key={p._id} className="rounded-md border p-3 dark:border-slate-800">
                    {p.user?.name || 'User'}: {p.text}
                    <div className="mt-2">
                      <Button onClick={()=>like(p._id)} className="mr-2">Like ({p.likes?.length||0})</Button>
                      <Button onClick={()=>comment(p._id)}>Comment</Button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ): (
            <div>Select a group to view posts</div>
          )}
        </div>
      </div>
    </div>
  )
}
