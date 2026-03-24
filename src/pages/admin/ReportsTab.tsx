import React, { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts"
import { Download } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import api from "../../services/api"

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy border border-white/10 p-3 rounded-xl shadow-xl backdrop-blur-md">
        <p className="font-bold text-white mb-1">{label}</p>
        <p className="text-emerald-400 font-medium">
          {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

export const ReportsTab = () => {
  const [subscriberData, setSubscriberData] = useState<any[]>([])
  const [charityData, setCharityData] = useState<any[]>([])
  const [prizeData, setPrizeData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, charityRes, prizeRes] = await Promise.all([
          api.get('/reports/subscribers'),
          api.get('/reports/charity'),
          api.get('/reports/prizes')
        ])
        setSubscriberData(subRes.data.data)
        setCharityData(charityRes.data.data.map((c: any) => ({ name: c.charity, value: c.total })))
        setPrizeData(prizeRes.data.data)
      } catch (err) {
        console.error("Failed to fetch reports", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleExportCSV = () => {
    // Generate simple CSV content from existing data
    const rows = [
      ["Report Type", "Metric", "Value"],
      ["Subscribers", "Total Count", subscriberData.length],
      ["Charity", "Impact Total", charityData.reduce((acc, c) => acc + c.value, 0)],
      ["Prize Pool", "Historical Total", prizeData.reduce((acc, p) => acc + p.total_pool, 0)],
      ...subscriberData.map(s => ["Subscriber Growth", s.month, s.count]),
      ...charityData.map(c => ["Charity Impact", c.name, c.value])
    ]

    const csvContent = "data:text/csv;charset=utf-8," 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `platform_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) return <div className="p-12 text-center text-white/50">Gathering platform intelligence...</div>

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Reports & Analytics</h1>
          <p className="text-white/60">Platform insights, financial metrics, and impact reporting.</p>
        </div>
        
        <Button 
          variant="outline" 
          className="shrink-0 bg-white/5 border-white/10 text-white hover:bg-white/10"
          onClick={handleExportCSV}
        >
          <Download size={16} className="mr-2" /> Export CSV Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Subscriber Growth Chart */}
        <Card className="border-white/10 bg-black/20 col-span-1 lg:col-span-2">
          <CardHeader className="border-b border-white/5 pb-4 px-6 md:px-8 pt-6 md:pt-8 flex flex-row items-center justify-between">
            <CardTitle>Platform Membership Growth</CardTitle>
            <div className="flex items-center gap-2">
              <span className="flex items-center text-xs font-semibold text-white/50">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></span> Active Members
              </span>
            </div>
          </CardHeader>
          <CardContent className="h-[400px] w-full p-4 md:p-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={subscriberData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Area type="monotone" dataKey="count" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorSub)" activeDot={{ r: 6, fill: '#059669', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Charity Distribution Chart */}
        <Card className="border-white/10 bg-black/20">
          <CardHeader className="border-b border-white/5">
            <CardTitle>Charity Impact Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] w-full p-4 md:p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charityData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" stroke="#ffffff50" tickFormatter={(value) => `$${value}`} tick={{ fill: '#ffffff50', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#ffffff50" tick={{ fill: '#ffffff90', fontSize: 13 }} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                <Bar dataKey="value" fill="#14B8A6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Prize Distribution Trend */}
        <Card className="border-white/10 bg-black/20">
          <CardHeader className="border-b border-white/5">
            <CardTitle>Prize Pool Value Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] w-full p-4 md:p-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prizeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#ffffff50" tickFormatter={(val) => `$${val}`} tick={{ fill: '#ffffff50', fontSize: 12 }} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Line type="monotone" dataKey="total_pool" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, fill: '#F59E0B', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#fff', stroke: '#F59E0B', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
