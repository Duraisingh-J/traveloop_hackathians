import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, PlusCircle, PenSquare, Trash2, Eye, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function MyTripsPage() {
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*, trip_stops(count)')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setTrips(data || [])
    } catch (err) {
      console.error('Error fetching trips:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteTrip = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trip?')) return
    try {
      const { error } = await supabase.from('trips').delete().eq('id', id)
      if (error) throw error
      setTrips(trips.filter(t => t.id !== id))
    } catch (err) {
      console.error('Error deleting trip:', err)
      alert('Could not delete trip.')
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD'
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Trips</h1>
          <p className="text-muted-foreground mt-1">Manage all your upcoming and past itineraries.</p>
        </div>
        <Button asChild>
          <Link to="/trips/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Plan New Trip
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
          <h3 className="text-lg font-semibold">No trips yet</h3>
          <p className="text-muted-foreground mb-6">Start planning your first adventure today.</p>
          <Button asChild variant="outline">
            <Link to="/trips/create">Create a Trip</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden group flex flex-col">
              <div className="h-48 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  src={trip.image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop'} 
                  alt={trip.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
              </div>
              
              <CardHeader className="pt-4 pb-2">
                <CardTitle className="text-xl line-clamp-1">{trip.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 pb-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-accent" />
                    {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-accent" />
                    {trip.trip_stops?.[0]?.count || 0} Destinations
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t bg-muted/20 p-4 flex justify-between">
                <Button asChild variant="ghost" size="sm" className="text-xs hover:text-accent">
                  <Link to={`/trips/${trip.id}`}>
                    <Eye className="mr-1.5 h-4 w-4" /> View
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-xs hover:text-primary">
                  <PenSquare className="mr-1.5 h-4 w-4" /> Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => deleteTrip(trip.id)}
                >
                  <Trash2 className="mr-1.5 h-4 w-4" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
