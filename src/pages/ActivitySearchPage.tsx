import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, Clock, IndianRupee, Plus, Filter, Tag, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const categories = ['All', 'Culture', 'Adventure', 'Food', 'Sightseeing', 'History']

export default function ActivitySearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase.from('activities').select('*')
      if (error) throw error
      setActivities(data || [])
    } catch (err) {
      console.error('Error fetching activities:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredActivities = activities.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.city_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'All' || a.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explore Activities</h1>
          <p className="text-muted-foreground mt-1">Find experiences to enrich your itinerary.</p>
        </div>
        <div className="w-full md:w-72 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search activities..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex items-center mr-2 text-muted-foreground">
          <Filter className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        {categories.map(cat => (
          <Button 
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
            className="rounded-full whitespace-nowrap"
          >
            {cat}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className="overflow-hidden flex flex-col group border shadow-sm hover:shadow-md transition-all">
              <div className="h-48 relative overflow-hidden bg-slate-100">
                <img 
                  src={activity.image_url} 
                  alt={activity.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-md text-xs font-semibold px-2 py-1 rounded shadow-sm flex items-center">
                  <Tag className="h-3 w-3 mr-1 text-accent" /> {activity.category}
                </div>
              </div>
              
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg leading-tight line-clamp-2">{activity.title}</h3>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <MapPin className="h-3.5 w-3.5 mr-1" /> {activity.city_name}
                </div>
                
                <div className="mt-auto pt-4 border-t flex items-center justify-between">
                  <div className="flex gap-4 text-sm font-medium">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      {activity.duration}
                    </div>
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                      {Number(activity.cost).toLocaleString('en-IN')}
                    </div>
                  </div>
                  
                  <Button size="sm" variant="secondary" className="font-semibold text-accent hover:text-accent-foreground hover:bg-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors whitespace-nowrap">
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredActivities.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl">
              <Search className="h-8 w-8 mb-4 opacity-20" />
              <p>No activities found matching your criteria.</p>
              <Button variant="link" onClick={() => {setSearchQuery(''); setActiveCategory('All')}}>Clear filters</Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
