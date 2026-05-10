import { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/useAuthStore'
import MainLayout from './layouts/MainLayout'
import TripLayout from './layouts/TripLayout'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import CreateTripPage from './pages/CreateTripPage'
import ItineraryBuilderPage from './pages/ItineraryBuilderPage'
import AuthPage from './pages/AuthPage'
import MyTripsPage from './pages/MyTripsPage'
import CitySearchPage from './pages/CitySearchPage'
import ActivitySearchPage from './pages/ActivitySearchPage'

// Phase 5 Pages
import ItineraryViewPage from './pages/ItineraryViewPage'
import TripBudgetPage from './pages/TripBudgetPage'
import ChecklistPage from './pages/ChecklistPage'
import NotesPage from './pages/NotesPage'
import ProfilePage from './pages/ProfilePage'

// Phase 6 Pages
import SharedTripPage from './pages/SharedTripPage'

function App() {
  const { setSession, session } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [setSession])

  // Simple route protection logic
  useEffect(() => {
    const isPublicRoute = 
      location.pathname === '/' || 
      location.pathname === '/login' ||
      location.pathname.startsWith('/shared/')

    if (!session && !isPublicRoute) {
      navigate('/login')
    } else if (session && location.pathname === '/login') {
      navigate('/dashboard')
    }
  }, [session, location.pathname, navigate])

  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/shared/:id" element={<SharedTripPage />} />
      
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Phase 2 Routes */}
        <Route path="/trips/create" element={<CreateTripPage />} />
        <Route path="/trips/build" element={<ItineraryBuilderPage />} />
        
        {/* Phase 3 Routes */}
        <Route path="/trips" element={<MyTripsPage />} />
        <Route path="/search/cities" element={<CitySearchPage />} />
        <Route path="/search/activities" element={<ActivitySearchPage />} />
        <Route path="/search" element={<CitySearchPage />} /> {/* Fallback */}
        
        {/* Phase 5 Routes */}
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Internal Trip View Routes */}
      <Route element={<MainLayout />}>
        <Route path="/trips/:id" element={<TripLayout />}>
          <Route index element={<ItineraryViewPage />} />
          <Route path="budget" element={<TripBudgetPage />} />
          <Route path="checklist" element={<ChecklistPage />} />
          <Route path="notes" element={<NotesPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
