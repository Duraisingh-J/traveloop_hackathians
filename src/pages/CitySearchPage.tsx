import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, TrendingUp, IndianRupee, Plus, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function CitySearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [cities, setCities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCities()
  }, [])

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase.from('cities').select('*').order('popularity', { ascending: false })
      if (error) throw error
      setCities(data || [])
    } catch (err) {
      console.error('Error fetching cities:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredCities = cities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderCost = (level: number) => {
    return Array.from({ length: 4 }).map((_, i) => (
      <IndianRupee key={i} className={`h-3 w-3 ${i < level ? 'text-foreground' : 'text-muted-foreground/30'}`} />
    ))
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col items-center text-center mb-10 mt-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Discover Destinations</h1>
        <p className="text-muted-foreground max-w-2xl">Search for cities, explore cost indicators, and add them directly to your active itinerary.</p>
        
        <div className="w-full max-w-xl mt-8 relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by city or country..." 
            className="pl-12 h-12 text-lg rounded-full shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight">Popular Right Now</h3>
        <div className="flex gap-2">
          {/* Filters could go here */}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <Card key={city.id} className="overflow-hidden group border-0 shadow-md">
              <div className="h-56 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  src={city.image_url} 
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm text-foreground text-xs font-bold px-2 py-1 rounded flex items-center shadow-sm">
                  <TrendingUp className="h-3 w-3 mr-1 text-accent" /> {city.popularity}%
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-2xl font-bold text-white leading-none mb-1">{city.name}</h3>
                      <div className="flex items-center text-white/80 text-sm">
                        <MapPin className="h-3 w-3 mr-1" /> {city.country}
                      </div>
                    </div>
                    <Button size="sm" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg h-9 w-9 p-0 flex items-center justify-center">
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
              <CardContent className="p-4 bg-card flex justify-between items-center border-t">
                <div className="text-sm font-medium text-muted-foreground">Est. Cost Level</div>
                <div className="flex items-center">
                  {renderCost(city.cost_index)}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredCities.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No destinations found matching "{searchQuery}".
            </div>
          )}
        </div>
      )}
    </div>
  )
}
