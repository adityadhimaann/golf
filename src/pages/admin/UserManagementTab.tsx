import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Edit2, ShieldAlert, CheckCircle2, UserCog, Ban, CheckCircle } from "lucide-react"
import { Card } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import { Modal } from "../../components/ui/Modal"
import api from "../../services/api"

export const UserManagementTab = () => {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [processing, setProcessing] = useState(false)

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/admin')
      const data = response.data.data || response.data
      const usersList = data.users || (Array.isArray(data) ? data : [])
      setUsers(usersList)
    } catch (err) {
      console.error("Failed to fetch users", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleUpdateUserStatus = async (status: string) => {
    if (!selectedUser) return
    setProcessing(true)
    try {
      await api.put(`/users/admin/${selectedUser._id}`, { status })
      setIsEditModalOpen(false)
      fetchUsers()
      alert(`User status updated to ${status}`)
    } catch (err) {
      alert("Failed to update user status")
    } finally {
      setProcessing(false)
    }
  }

  const handleVerifyUser = async () => {
    if (!selectedUser) return
    setProcessing(true)
    try {
      await api.put(`/users/admin/${selectedUser._id}`, { is_verified: !selectedUser.is_verified })
      setIsEditModalOpen(false)
      fetchUsers()
      alert(selectedUser.is_verified ? "Verification removed" : "User verified successfully")
    } catch (err) {
      alert("Verification update failed")
    } finally {
      setProcessing(false)
    }
  }

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const openEditModal = (user: any) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  if (loading) return <div className="p-12 text-center text-white/50 font-medium">Gathering player data...</div>

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">User Management</h1>
          <p className="text-white/60">Manage subscribers, verify identities, and handle account status.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-sans text-sm" 
          />
        </div>
      </div>

      <Card className="border-white/10 bg-black/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-6 py-4 font-semibold text-white/50 text-xs uppercase tracking-wider">User</th>
                <th className="px-6 py-4 font-semibold text-white/50 text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold text-white/50 text-xs uppercase tracking-wider">Verification</th>
                <th className="px-6 py-4 font-semibold text-white/50 text-xs uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 font-semibold text-white/50 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 font-bold text-xs uppercase">
                        {user.full_name?.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{user.full_name}</div>
                        <div className="text-white/50 text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={user.status === "active" ? "success" : "error"}>{user.status}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.is_verified ? (
                      <Badge variant="default" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-1 w-fit">
                        <CheckCircle size={10} /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-white/40">Not Verified</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white/40 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(user)}>
                      <UserCog size={16} className="mr-2" /> Manage
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/50">No users matched your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Administrative Controls">
        {selectedUser && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-lg">{selectedUser.full_name}</h3>
                <p className="text-white/50 text-sm">{selectedUser.email}</p>
              </div>
              <Badge variant={selectedUser.status === 'active' ? 'success' : 'error'}>{selectedUser.status}</Badge>
            </div>

            <div className="space-y-4">
               <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Administrative Actions</h4>
               <div className="grid grid-cols-1 gap-3">
                  <Button 
                    variant="outline" 
                    className="justify-start h-12"
                    onClick={handleVerifyUser}
                    isLoading={processing}
                  >
                    <CheckCircle2 size={18} className={`mr-3 ${selectedUser.is_verified ? 'text-emerald-400' : 'text-white/40'}`} />
                    {selectedUser.is_verified ? "Revoke Identity Verification" : "Verify Identity Proof"}
                  </Button>
                  
                  {selectedUser.status === 'active' ? (
                    <Button 
                      variant="danger" 
                      className="justify-start h-12 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
                      onClick={() => handleUpdateUserStatus('suspended')}
                      isLoading={processing}
                    >
                      <Ban size={18} className="mr-3" /> Suspend Member Account
                    </Button>
                  ) : (
                    <Button 
                      variant="primary" 
                      className="justify-start h-12 bg-emerald-500 text-white"
                      onClick={() => handleUpdateUserStatus('active')}
                      isLoading={processing}
                    >
                      <CheckCircle2 size={18} className="mr-3" /> Re-activate Account
                    </Button>
                  )}
               </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex justify-end">
              <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Close Oversight</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
