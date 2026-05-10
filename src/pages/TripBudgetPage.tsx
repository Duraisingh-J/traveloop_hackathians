import { useOutletContext } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { IndianRupee } from 'lucide-react'

// Dummy budget data for demonstration. In a real app, this would be calculated from the DB activities and user inputs.
const budgetData = [
  { name: 'Transport', value: 45000, color: '#0EA5E9' },
  { name: 'Accommodation', value: 35000, color: '#3B82F6' },
  { name: 'Activities', value: 15000, color: '#8B5CF6' },
  { name: 'Food & Dining', value: 25000, color: '#10B981' },
]

export default function TripBudgetPage() {
  const { trip } = useOutletContext<{ trip: any }>()
  
  const totalBudget = budgetData.reduce((acc, item) => acc + item.value, 0)

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Budget & Expenses</h2>
        <p className="text-muted-foreground mt-1">Track your estimated costs for this trip.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 glass bg-primary text-primary-foreground border-0">
          <CardHeader>
            <CardTitle className="text-primary-foreground/80 text-sm font-medium uppercase tracking-wider">Estimated Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold flex items-center">
              <IndianRupee className="h-8 w-8 mr-1 opacity-80" />
              {totalBudget.toLocaleString('en-IN')}
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm border-b border-primary-foreground/20 pb-2">
                <span className="opacity-80">Daily Average</span>
                <span className="font-semibold">₹{(totalBudget / 7).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-80">Status</span>
                <span className="font-semibold text-green-400">On Track</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
            <CardDescription>Visualization of your planned expenses.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="middle" align="right" layout="vertical" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgetData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className="font-bold">₹{item.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
