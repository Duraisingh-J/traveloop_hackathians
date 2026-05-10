import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckSquare, Plus, Trash2 } from 'lucide-react'

type ChecklistItem = {
  id: string
  text: string
  completed: boolean
  category: string
}

const initialItems: ChecklistItem[] = [
  { id: '1', text: 'Passport', completed: true, category: 'Documents' },
  { id: '2', text: 'Flight Tickets', completed: false, category: 'Documents' },
  { id: '3', text: 'Phone Charger', completed: false, category: 'Electronics' },
  { id: '4', text: 'Camera', completed: false, category: 'Electronics' },
  { id: '5', text: 'Swimwear', completed: false, category: 'Clothing' },
  { id: '6', text: 'Comfortable Shoes', completed: false, category: 'Clothing' },
]

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems)
  const [newItem, setNewItem] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', 'Documents', 'Electronics', 'Clothing', 'Misc']

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem.trim()) return
    
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        text: newItem,
        completed: false,
        category: activeCategory === 'All' ? 'Misc' : activeCategory
      }
    ])
    setNewItem('')
  }

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item))
  }

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const filteredItems = items.filter(item => activeCategory === 'All' || item.category === activeCategory)
  const completedCount = items.filter(item => item.completed).length

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Packing Checklist</h2>
          <p className="text-muted-foreground mt-1">Don't forget the essentials. Track what you pack.</p>
        </div>
        <div className="text-sm font-medium bg-accent/10 text-accent px-4 py-2 rounded-full">
          {completedCount} of {items.length} packed ({Math.round((completedCount / (items.length || 1)) * 100)}%)
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${(completedCount / (items.length || 1)) * 100}%` }}
        />
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Add New Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex gap-2">
            <Input 
              placeholder="e.g. Travel Adapter" 
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!newItem.trim()} className="whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </form>

          <div className="flex items-center gap-2 mt-4 overflow-x-auto hide-scrollbar pb-2">
            {categories.map(cat => (
              <Button 
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className="rounded-full"
              >
                {cat}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl bg-card">
            No items in this category.
          </div>
        ) : (
          filteredItems.map(item => (
            <div 
              key={item.id} 
              className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                item.completed ? 'bg-muted/50 text-muted-foreground' : 'bg-card shadow-sm hover:border-accent/50'
              }`}
            >
              <div 
                className="flex items-center gap-4 flex-1 cursor-pointer"
                onClick={() => toggleItem(item.id)}
              >
                <div className={`h-6 w-6 rounded border-2 flex items-center justify-center transition-colors ${
                  item.completed ? 'bg-accent border-accent text-white' : 'border-muted-foreground/30'
                }`}>
                  {item.completed && <CheckSquare className="h-4 w-4" />}
                </div>
                <span className={`text-base font-medium ${item.completed ? 'line-through decoration-muted-foreground/50' : ''}`}>
                  {item.text}
                </span>
                <span className="text-xs bg-muted px-2 py-1 rounded ml-auto mr-4">
                  {item.category}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => deleteItem(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
