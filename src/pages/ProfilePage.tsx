import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/useAuthStore'
import { supabase } from '@/lib/supabase'
import { User, Mail, LogOut, Loader2, Save, Globe, Trash2, Camera, Heart, MapPin } from 'lucide-react'

// Dummy saved destinations
const savedDestinations = [
  { id: '1', city: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=2000' },
  { id: '2', city: 'Kyoto', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000' }
]

export default function ProfilePage() {
  const { user } = useAuthStore()
  const [fullName, setFullName] = useState('')
  const [language, setLanguage] = useState('en')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name)
    }
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      })
      if (error) throw error
      setMessage({ text: 'Profile updated successfully!', type: 'success' })
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('WARNING: This action is irreversible. Are you sure you want to permanently delete your account and all associated trips?')) return
    setDeleting(true)
    try {
      // Typically requires an Edge Function or Supabase Admin API to fully delete.
      // We simulate by signing out here.
      alert('Account deletion requested. You will be signed out.')
      await supabase.auth.signOut()
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and personal information.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Quick Actions */}
        <div className="space-y-6">
          <Card className="glass border-0 text-center shadow-md">
            <CardContent className="pt-6">
              <div className="relative w-32 h-32 mx-auto mb-4 group cursor-pointer">
                <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-background shadow-lg overflow-hidden flex items-center justify-center">
                  <User className="h-16 w-16 text-muted-foreground opacity-50" />
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera className="h-8 w-8" />
                </div>
              </div>
              <h3 className="font-bold text-lg">{fullName || 'Traveler'}</h3>
              <p className="text-sm text-muted-foreground break-all">{user?.email}</p>
            </CardContent>
          </Card>

          <Card className="border border-destructive/20 shadow-sm bg-destructive/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-destructive text-lg">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">Permanently delete your account and all of your content.</p>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />} 
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Settings */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your display name and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                
                {message.text && (
                  <div className={`p-3 text-sm rounded-md font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
                    {message.text}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      value={user?.email || ''} 
                      className="pl-9 bg-muted/50 cursor-not-allowed" 
                      disabled 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="pl-9" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Language Preference</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <select 
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <Button type="button" variant="outline" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </Button>
                  
                  <Button type="submit" disabled={loading || fullName === user?.user_metadata?.full_name}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} 
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
              <div>
                <CardTitle>Saved Destinations</CardTitle>
                <CardDescription>Places you've bookmarked for later.</CardDescription>
              </div>
              <Heart className="h-5 w-5 text-destructive fill-destructive" />
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {savedDestinations.map(dest => (
                  <div key={dest.id} className="relative h-32 rounded-xl overflow-hidden group cursor-pointer">
                    <img src={dest.image} alt={dest.city} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                      <div>
                        <h4 className="text-white font-bold">{dest.city}</h4>
                        <div className="flex items-center text-white/80 text-xs">
                          <MapPin className="h-3 w-3 mr-1" /> {dest.country}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
