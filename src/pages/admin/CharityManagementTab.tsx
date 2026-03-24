import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit2, Trash2, Heart, Search, CheckCircle2, Image as ImageIcon, X } from "lucide-react"
import { Card } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import { Modal } from "../../components/ui/Modal"
import api from "../../services/api"

export const CharityManagementTab = () => {
  const [charities, setCharities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCharity, setSelectedCharity] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [processing, setProcessing] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    category: "General",
    website_url: "",
    is_featured: false
  })

  const fetchCharities = async () => {
    try {
      const response = await api.get('/charities')
      const data = response.data.data || response.data
      setCharities(Array.isArray(data) ? data : (data.charities || []))
    } catch (err) {
      console.error("Failed to fetch charities", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCharities()
  }, [])

  const handleOpenModal = (charity: any = null) => {
    if (charity) {
      setSelectedCharity(charity)
      setFormData({
        name: charity.name,
        description: charity.description || "",
        image_url: charity.image_url || "",
        category: charity.category || "General",
        website_url: charity.website_url || "",
        is_featured: charity.is_featured || false
      })
    } else {
      setSelectedCharity(null)
      setFormData({
        name: "",
        description: "",
        image_url: "",
        category: "General",
        website_url: "",
        is_featured: false
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    try {
      if (selectedCharity) {
        await api.put(`/charities/${selectedCharity._id}`, formData)
        alert("Charity updated!")
      } else {
        await api.post('/charities', formData)
        alert("Charity created!")
      }
      setIsModalOpen(false)
      fetchCharities()
    } catch (err: any) {
      console.error("Save failed", err)
      alert(err.response?.data?.message || "Oops! Failed to save charity. Check your network or details.")
    } finally {
      setProcessing(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this charity?")) return
    setProcessing(true)
    try {
      await api.delete(`/charities/${id}`)
      fetchCharities()
      alert("Charity deleted successfully")
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed: Perhaps users are currently supporting this charity?")
    } finally {
      setProcessing(false)
    }
  }

  const filteredCharities = charities.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="p-12 text-center text-white/50">Gathering charity database...</div>

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Charity Management</h1>
          <p className="text-white/60">Add, edit, and monitor charitable partners.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Filter charities..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-sans text-sm" 
            />
          </div>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <Plus size={18} className="mr-2" /> Add New
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharities.map((charity) => (
          <motion.div key={charity._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="overflow-hidden border-white/10 bg-black/20 group hover:border-emerald-500/30 transition-all h-full flex flex-col">
              <div className="h-40 relative overflow-hidden bg-black/40">
                {charity.image_url ? (
                  <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10">
                    <Heart size={48} />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <Badge variant="success" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{charity.category}</Badge>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{charity.name}</h3>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(charity)} className="h-8 w-8 p-0 text-white/40 hover:text-white"><Edit2 size={14} /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(charity._id)} className="h-8 w-8 p-0 text-white/40 hover:text-red-400"><Trash2 size={14} /></Button>
                  </div>
                </div>
                <p className="text-sm text-white/50 line-clamp-2 mb-6 flex-1">{charity.description}</p>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Status</span>
                    <Badge variant={charity.is_featured ? "warning" : "default"}>{charity.is_featured ? "Featured" : "Standard"}</Badge>
                  </div>
                  {charity.website_url && (
                    <a href={charity.website_url} target="_blank" rel="noreferrer" className="text-xs text-emerald-400 hover:underline">Website</a>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {filteredCharities.length === 0 && (
           <div className="col-span-full py-20 text-center text-white/30 font-medium">No charities found matching "{search}"</div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedCharity ? "Edit Charity" : "Add New Charity"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Charity Name</label>
            <input 
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Golfers Against Cancer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="General">General</option>
                <option value="Health">Health</option>
                <option value="Youth">Youth</option>
                <option value="Environment">Environment</option>
                <option value="Veterans">Veterans</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Logo URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input 
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="https://image-url.com"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Website URL</label>
            <input 
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData({...formData, website_url: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              placeholder="https://charity-site.org"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Description</label>
            <textarea 
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              placeholder="Brief overview of the charity mission..."
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <input 
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
              className="w-5 h-5 rounded border-white/20 bg-black/20 text-emerald-500 focus:ring-emerald-500"
            />
            <label htmlFor="is_featured" className="text-sm font-medium text-white">Feature this charity on homepage</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" isLoading={processing}>
              {selectedCharity ? "Update Charity" : "Create Charity"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
