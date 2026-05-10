import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { IndianRupee, Plus, Trash2, TrendingUp, Wallet, BarChart3, ArrowUpRight } from 'lucide-react'

const COLORS = ['#0EA5E9', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444']

const CATEGORIES = ['Transport', 'Accommodation', 'Activities', 'Food & Dining', 'Shopping', 'Other']

type BudgetItem = {
  id: string
  category: string
  label: string
  amount: number
  color: string
}

const defaultItems: BudgetItem[] = [
  { id: '1', category: 'Transport', label: 'Flight tickets', amount: 25000, color: COLORS[0] },
  { id: '2', category: 'Transport', label: 'Local transit', amount: 5000, color: COLORS[0] },
  { id: '3', category: 'Accommodation', label: 'Hotel (5 nights)', amount: 35000, color: COLORS[1] },
  { id: '4', category: 'Activities', label: 'Tour packages', amount: 8000, color: COLORS[2] },
  { id: '5', category: 'Activities', label: 'Museum entries', amount: 3000, color: COLORS[2] },
  { id: '6', category: 'Food & Dining', label: 'Restaurants', amount: 15000, color: COLORS[3] },
  { id: '7', category: 'Food & Dining', label: 'Snacks & drinks', amount: 5000, color: COLORS[3] },
]

export default function TripBudgetPage() {
  const { trip } = useOutletContext<{ trip: any }>()
  const [items, setItems] = useState<BudgetItem[]>(defaultItems)
  const [newLabel, setNewLabel] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [newCategory, setNewCategory] = useState('Transport')
  const [showAddForm, setShowAddForm] = useState(false)

  const totalBudget = items.reduce((acc, item) => acc + item.amount, 0)

  // Group by category for pie chart
  const pieData = CATEGORIES
    .map((cat, i) => ({
      name: cat,
      value: items.filter(it => it.category === cat).reduce((a, b) => a + b.amount, 0),
      color: COLORS[i],
    }))
    .filter(d => d.value > 0)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLabel.trim() || !newAmount) return
    const catIndex = CATEGORIES.indexOf(newCategory)
    setItems([...items, {
      id: crypto.randomUUID(),
      category: newCategory,
      label: newLabel,
      amount: Number(newAmount),
      color: COLORS[catIndex >= 0 ? catIndex : 0]
    }])
    setNewLabel('')
    setNewAmount('')
    setShowAddForm(false)
  }

  const deleteItem = (id: string) => setItems(items.filter(it => it.id !== id))

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 pb-20 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Budget & Expenses</h2>
          <p className="text-muted-foreground mt-1">Track estimated costs for <span className="font-semibold text-foreground">{trip?.title}</span>.</p>
        </div>
        <Button onClick={() => setShowAddForm(v => !v)} className="rounded-full px-5 shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <Card className="border-accent/30 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">New Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="flex flex-wrap gap-3">
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm flex-1 min-w-[130px]"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <Input
                placeholder="Description (e.g. Hotel)"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                className="flex-[2] min-w-[160px]"
              />
              <div className="relative min-w-[120px] flex-1">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={newAmount}
                  onChange={e => setNewAmount(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button type="submit" className="rounded-full px-6">
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Budget', value: `₹${totalBudget.toLocaleString('en-IN')}`, icon: Wallet, color: 'text-accent' },
          { label: 'Daily Average', value: `₹${Math.round(totalBudget / 7).toLocaleString('en-IN')}`, icon: BarChart3, color: 'text-purple-500' },
          { label: 'Largest Cost', value: pieData[0]?.name || '—', icon: ArrowUpRight, color: 'text-orange-400' },
          { label: 'Status', value: 'On Track', icon: TrendingUp, color: 'text-green-500' },
        ].map(stat => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`mb-2 ${stat.color}`}><stat.icon className="h-5 w-5" /></div>
              <div className="text-lg font-bold truncate">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + Categories */}
      <div className="grid md:grid-cols-5 gap-6">

        {/* Pie Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
            <CardDescription>Total: ₹{totalBudget.toLocaleString('en-IN')}</CardDescription>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={78}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>By Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pieData.map(cat => (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="font-medium">{cat.name}</span>
                  </div>
                  <span className="font-semibold">₹{cat.value.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(cat.value / totalBudget) * 100}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Itemised List */}
      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
          <CardDescription>{items.length} items tracked</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/40 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm">₹{item.amount.toLocaleString('en-IN')}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
