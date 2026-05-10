import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useTripStore } from '@/store/useTripStore'
import { useAuthStore } from '@/store/useAuthStore'
import { supabase } from '@/lib/supabase'
import { ImagePlus, Map, Loader2 } from 'lucide-react'

export default function CreateTripPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { tripName, description, startDate, endDate, setTripDetails } = useTripStore()
  const [saving, setSaving] = useState(false)

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tripName || !user) return
    
    setSaving(true)
    try {
      // Create trip in Database first
      const { data, error } = await supabase.from('trips').insert({
        user_id: user.id,
        title: tripName,
        description: description,
        start_date: startDate || null,
        end_date: endDate || null,
        // Optional placeholder image
        image_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop'
      }).select().single()

      if (error) throw error

      // Proceed to itinerary builder
      // Note: we might want to store the returned trip ID in the store
      navigate('/trips/build')
    } catch (err) {
      console.error('Error creating trip:', err)
      alert('Could not create trip. Please ensure you are logged in.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create a New Trip</h1>
        <p className="text-muted-foreground mt-1">Start planning your next great adventure.</p>
      </div>

      <form onSubmit={handleNext}>
        <Card className="glass border-0 shadow-md">
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
            <CardDescription>Give your trip a name and let us know when you are going.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Trip Name *
              </label>
              <Input 
                placeholder="e.g. Summer Backpacking in Europe" 
                value={tripName}
                onChange={(e) => setTripDetails({ tripName: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Start Date</label>
                <Input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setTripDetails({ startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">End Date</label>
                <Input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setTripDetails({ endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Description</label>
              <Textarea 
                placeholder="Briefly describe what this trip is about..." 
                value={description}
                onChange={(e) => setTripDetails({ description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Cover Image</label>
              <div className="border-2 border-dashed rounded-xl h-32 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer bg-card/50">
                <ImagePlus className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">Click to upload cover image</span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continue to Itinerary Builder'} 
                {!saving && <Map className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
