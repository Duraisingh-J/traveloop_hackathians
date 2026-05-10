import { useEffect, useState } from 'react'
import { Outlet, useParams, Link, useLocation } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft, Map, Wallet, CheckSquare, FileText, PencilLine } from 'lucide-react'

export default function TripLayout() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const [trip, setTrip] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) fetchTrip()
  }, [id])

  const fetchTrip = async () => {
    try {
      const { data, error } = await supabase.from('trips').select('*').eq('id', id).single()
      if (error) throw error
      setTrip(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">Trip not found</h2>
        <Link to="/trips" className="text-accent hover:underline mt-4 inline-block">Return to My Trips</Link>
      </div>
    )
  }

  const tabs = [
    { name: 'Itinerary', path: `/trips/${id}`, icon: Map },
    { name: 'Budget', path: `/trips/${id}/budget`, icon: Wallet },
    { name: 'Checklist', path: `/trips/${id}/checklist`, icon: CheckSquare },
    { name: 'Notes', path: `/trips/${id}/notes`, icon: FileText },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Trip Header */}
      <div className="bg-slate-900 text-white relative h-48 md:h-64 flex-shrink-0">
        <img 
          src={trip.image_url} 
          alt={trip.title}
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        
        <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-between max-w-7xl mx-auto w-full">
          <Link to="/trips" className="inline-flex items-center text-sm font-medium hover:text-accent transition-colors w-fit">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Trips
          </Link>
          
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">{trip.title}</h1>
              <p className="text-white/80 max-w-2xl line-clamp-2">{trip.description || 'No description provided.'}</p>
            </div>
            <Button asChild size="sm" className="rounded-full px-5 shrink-0 mb-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm">
              <Link to="/trips/build">
                <PencilLine className="mr-2 h-4 w-4" /> Edit Itinerary
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="bg-card border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <nav className="flex space-x-8 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = location.pathname === tab.path
              return (
                <Link
                  key={tab.name}
                  to={tab.path}
                  className={`flex items-center py-4 border-b-2 px-1 text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive 
                      ? 'border-accent text-accent' 
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                  }`}
                >
                  <Icon className={`mr-2 h-4 w-4 ${isActive ? 'text-accent' : 'opacity-70'}`} />
                  {tab.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Internal Page Content */}
      <div className="flex-1 bg-background">
        <Outlet context={{ trip }} />
      </div>
    </div>
  )
}
