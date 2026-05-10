import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Loader2, MapPin, Clock, Copy, Share2, Link as LinkIcon, Compass, IndianRupee } from 'lucide-react'

// Custom Map Icon
const createCustomIcon = (index: number) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: #0EA5E9; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${index}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

export default function SharedTripPage() {
  const { id } = useParams<{ id: string }>()
  const [trip, setTrip] = useState<any>(null)
  const [stops, setStops] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    if (id) fetchTripData()
  }, [id])

  const fetchTripData = async () => {
    try {
      // Fetch trip details
      const { data: tripData, error: tripError } = await supabase.from('trips').select('*').eq('id', id).single()
      if (tripError) throw tripError
      setTrip(tripData)

      // Fetch stops
      const { data: stopsData, error: stopsError } = await supabase
        .from('trip_stops')
        .select('*, activities(*)')
        .eq('trip_id', id)
        .order('stop_order', { ascending: true })
      if (stopsError) throw stopsError
      setStops(stopsData || [])

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Public link copied to clipboard!')
    setShowShareModal(false)
  }

  const handleCopyTrip = () => {
    // In a real app, this would duplicate the trip records to the logged-in user's account.
    alert('This trip has been copied to your "My Trips" dashboard! (Mock action)')
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="flex flex-col h-screen items-center justify-center p-8 text-center bg-background">
        <Compass className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
        <h2 className="text-2xl font-bold">Trip not found</h2>
        <p className="text-muted-foreground mt-2 max-w-md">This itinerary might be private or the link is invalid.</p>
        <Button asChild className="mt-6">
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    )
  }

  // Calculate Map Bounds
  const mapCenter: [number, number] = stops.length > 0 && stops[0].lat && stops[0].lng 
    ? [stops[0].lat, stops[0].lng] 
    : [20, 0]

  return (
    <div className="min-h-screen bg-background">
      {/* Public Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Compass className="h-6 w-6 text-accent" />
          <span className="text-xl font-bold tracking-tight hidden sm:inline-block">Traveloop</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => setShowShareModal(!showShareModal)} className="rounded-full px-4">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button size="sm" onClick={handleCopyTrip} className="rounded-full px-4">
            <Copy className="mr-2 h-4 w-4" /> Copy Trip
          </Button>
        </div>
      </header>

      {/* Share Modal (Simple popup) */}
      {showShareModal && (
        <div className="fixed top-20 right-6 z-50 bg-card border rounded-lg shadow-xl p-4 w-64 animate-in fade-in slide-in-from-top-4">
          <h4 className="font-semibold mb-3">Share this Itinerary</h4>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={handleCopyLink}>
              <LinkIcon className="mr-2 h-4 w-4" /> Copy Link
            </Button>
            <Button variant="outline" className="w-full justify-start text-[#1DA1F2]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              Post on Twitter
            </Button>
            <Button variant="outline" className="w-full justify-start text-[#1877F2]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              Share on Facebook
            </Button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-64 md:h-80 w-full">
        <img 
          src={trip.image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80'} 
          alt={trip.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-7xl mx-auto">
          <div className="inline-block px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full mb-3 shadow-md">
            Public Itinerary
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{trip.title}</h1>
          <p className="text-white/80 max-w-2xl text-lg">{trip.description || 'An inspiring journey.'}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Map */}
        <div className="w-full lg:w-1/2">
          <div className="sticky top-24">
            <Card className="overflow-hidden border-2 h-[400px] lg:h-[600px] shadow-md">
              <MapContainer 
                center={mapCenter} 
                zoom={4} 
                scrollWheelZoom={true} 
                className="w-full h-full z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {stops.length > 1 && (
                  <Polyline 
                    positions={stops.filter(s => s.lat && s.lng).map(s => [s.lat, s.lng])} 
                    pathOptions={{ color: '#0EA5E9', weight: 3, dashArray: '5, 10' }} 
                  />
                )}
                {stops.map((stop: any, index) => stop.lat && stop.lng ? (
                  <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={createCustomIcon(index + 1)}>
                    <Popup>
                      <div className="font-semibold">{stop.city_name}</div>
                      <div className="text-xs text-muted-foreground">Stop {index + 1}</div>
                    </Popup>
                  </Marker>
                ) : null)}
              </MapContainer>
            </Card>
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div className="w-full lg:w-1/2">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <MapPin className="mr-2 h-6 w-6 text-accent" /> Day by Day
          </h3>
          
          <div className="relative border-l-2 border-muted pl-6 ml-4 space-y-12 pb-12">
            {stops.map((stop, index) => (
              <div key={stop.id} className="relative">
                <div className="absolute -left-[35px] top-1 h-6 w-6 rounded-full bg-card border-4 border-muted flex items-center justify-center">
                  <div className="h-1.5 w-1.5 bg-accent rounded-full" />
                </div>
                
                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Stop {index + 1}</span>
                  <h2 className="text-2xl font-bold">{stop.city_name}</h2>
                </div>
                
                <div className="space-y-4">
                  {stop.activities && stop.activities.length > 0 ? (
                    stop.activities.map((activity: any) => (
                      <Card key={activity.id} className="overflow-hidden shadow-sm">
                        <CardContent className="p-0 flex flex-col sm:flex-row">
                          <div className="w-full sm:w-28 h-28 shrink-0">
                            <img src={activity.image_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073'} alt={activity.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-center">
                            <h4 className="font-bold mb-1">{activity.title}</h4>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {activity.duration || '2 hours'}</div>
                              <div className="flex items-center"><IndianRupee className="h-3 w-3 mr-1" /> {activity.cost ? Number(activity.cost).toLocaleString('en-IN') : 'Free'}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
                      Free time to explore {stop.city_name}.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
