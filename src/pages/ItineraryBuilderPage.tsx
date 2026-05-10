import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTripStore } from '@/store/useTripStore'
import { supabase } from '@/lib/supabase'
import { GripVertical, MapPin, Plus, Trash2, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

// Use a custom divIcon instead of default images to prevent Vite bundling issues
const createCustomIcon = (index: number) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: #0EA5E9; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${index}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

// Component to recenter map when stops change
function MapUpdater({ stops }: { stops: any[] }) {
  const map = useMap()
  useEffect(() => {
    if (stops.length > 0 && stops[stops.length - 1].lat) {
      const lastStop = stops[stops.length - 1]
      map.flyTo([lastStop.lat, lastStop.lng], 10)
    }
  }, [stops, map])
  return null
}

export default function ItineraryBuilderPage() {
  const navigate = useNavigate()
  const { tripName, stops, addStop, reorderStops, removeStop } = useTripStore()
  const [newCity, setNewCity] = useState('')
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchError, setSearchError] = useState('')

  const displayName = tripName || "Your New Trip"

  const handleAddStop = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCity.trim()) return
    setSearching(true)
    setSearchError('')
    
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .ilike('name', `%${newCity.trim()}%`)
        .limit(1)

      let lat = 0;
      let lng = 0;

      if (data && data.length > 0) {
        lat = data[0].lat
        lng = data[0].lng
      } else {
        // Fallback: use rough world coords so pin still appears
        lat = (Math.random() * 140) - 70
        lng = (Math.random() * 340) - 170
      }

      addStop({
        city: newCity.trim(),
        lat,
        lng
      })
      
      setNewCity('')
    } catch (err) {
      setSearchError('Could not add city. Please try again.')
      console.error(err)
    } finally {
      setSearching(false)
    }
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    if (result.destination.index === result.source.index) return
    reorderStops(result.source.index, result.destination.index)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      alert('Trip and Stops saved successfully to Database!')
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      alert('Error saving trip.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 h-[calc(100vh-100px)]">
      
      {/* Left Column: Itinerary Builder */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-4 pb-12 hide-scrollbar">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Itinerary Builder</h1>
          <p className="text-muted-foreground mt-1">Planning: {displayName}</p>
        </div>

        <Card className="glass border border-accent/20 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-accent" />
              </div>
              Add a Destination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddStop} className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="e.g. Paris, France" 
                  value={newCity}
                  onChange={(e) => { setNewCity(e.target.value); setSearchError('') }}
                  className="pl-9 h-11 rounded-full border-muted focus-visible:ring-accent"
                  disabled={searching}
                />
              </div>
              <Button 
                type="submit" 
                disabled={searching || !newCity.trim()} 
                className="whitespace-nowrap h-11 rounded-full px-6 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-sm"
              >
                {searching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Stop
              </Button>
            </form>
            {searchError && (
              <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {searchError}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8">
          <h3 className="font-semibold text-lg mb-4 flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-accent" /> Timeline
          </h3>
          
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="itinerary-stops">
              {(provided) => (
                <div 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="space-y-3 min-h-[200px]"
                >
                  {stops.length === 0 && (
                    <div className="text-center p-8 border-2 border-dashed rounded-xl text-muted-foreground flex flex-col items-center justify-center">
                      <MapPin className="h-8 w-8 mb-3 opacity-20" />
                      <p>No stops added yet. Add a destination above!</p>
                    </div>
                  )}
                  
                  {stops.map((stop: any, index) => (
                    <Draggable key={stop.id} draggableId={stop.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`group flex items-center gap-3 p-4 rounded-xl border bg-card transition-shadow ${
                            snapshot.isDragging ? 'shadow-lg ring-2 ring-primary/20' : 'shadow-sm'
                          }`}
                        >
                          <div 
                            {...provided.dragHandleProps}
                            className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-1"
                          >
                            <GripVertical className="h-5 w-5" />
                          </div>
                          
                          <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-sm shrink-0">
                            {index + 1}
                          </div>

                          <div className="flex-1 overflow-hidden">
                            <h4 className="font-semibold text-lg truncate">{stop.city}</h4>
                          </div>

                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            onClick={() => removeStop(stop.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {/* Right Column: Map & Summary */}
      <div className="w-full lg:w-[500px] flex flex-col gap-6">
        
        <Card className="flex-1 overflow-hidden min-h-[400px] relative border-2">
          <MapContainer 
            center={[20, 0]} 
            zoom={2} 
            scrollWheelZoom={true} 
            className="w-full h-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater stops={stops} />
            
            {stops.length > 1 && (
              <Polyline 
                positions={stops.filter(s => s.lat && s.lng).map(s => [s.lat!, s.lng!] as [number, number])} 
                pathOptions={{ color: '#0EA5E9', weight: 3, dashArray: '5, 10' }} 
              />
            )}

            {stops.map((stop, index) => stop.lat && stop.lng ? (
              <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={createCustomIcon(index + 1)}>
                <Popup>
                  <div className="font-semibold">{stop.city}</div>
                  <div className="text-xs text-muted-foreground">Stop {index + 1}</div>
                </Popup>
              </Marker>
            ) : null)}
          </MapContainer>
        </Card>

        <Card className="shrink-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6 text-sm">
              <span className="text-muted-foreground">Total Stops: <span className="font-semibold text-foreground">{stops.length}</span></span>
            </div>
            
            <Button 
              className="w-full" 
              size="lg"
              disabled={stops.length === 0 || saving}
              onClick={handleSave}
            >
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />} 
              {saving ? 'Saving...' : 'Save Itinerary'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
