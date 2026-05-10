import { useEffect, useState } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, MapPin, Clock, IndianRupee } from 'lucide-react'

export default function ItineraryViewPage() {
  const { id } = useParams<{ id: string }>()
  const { trip } = useOutletContext<{ trip: any }>()
  const [stops, setStops] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStops()
  }, [id])

  const fetchStops = async () => {
    try {
      const { data, error } = await supabase
        .from('trip_stops')
        .select('*, activities(*)')
        .eq('trip_id', id)
        .order('stop_order', { ascending: true })
      
      if (error) throw error
      setStops(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      {stops.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl bg-card">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
          <h3 className="text-lg font-semibold">Empty Itinerary</h3>
          <p className="text-muted-foreground">You haven't added any destinations to this trip yet.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-accent/30 pl-6 ml-4 space-y-12">
          {stops.map((stop, index) => (
            <div key={stop.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[35px] top-1 h-6 w-6 rounded-full bg-accent border-4 border-background flex items-center justify-center shadow-sm">
                <div className="h-1.5 w-1.5 bg-white rounded-full" />
              </div>
              
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-accent mb-1 block">Stop {index + 1}</span>
                <h2 className="text-2xl font-bold">{stop.city_name}</h2>
              </div>
              
              <div className="space-y-4">
                {stop.activities && stop.activities.length > 0 ? (
                  stop.activities.map((activity: any) => (
                    <Card key={activity.id} className="overflow-hidden border-l-4 border-l-accent/50 hover:border-l-accent transition-colors">
                      <CardContent className="p-0 flex flex-col sm:flex-row">
                        <div className="w-full sm:w-32 h-32 shrink-0">
                          <img src={activity.image_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073'} alt={activity.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-center">
                          <h4 className="font-bold text-lg mb-2">{activity.title}</h4>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {activity.duration || '2 hours'}</div>
                            <div className="flex items-center"><IndianRupee className="h-4 w-4 mr-1" /> {activity.cost ? Number(activity.cost).toLocaleString('en-IN') : 'Free'}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
                    No activities planned for this stop yet.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
