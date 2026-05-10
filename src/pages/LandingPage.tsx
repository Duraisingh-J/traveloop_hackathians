import { Link } from 'react-router-dom'
import { ArrowRight, Globe, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 flex flex-col items-center text-center px-4">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-8">
          Welcome to Traveloop 2.0
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mb-6 text-primary">
          Personalized Travel Planning <br className="hidden md:inline" />
          <span className="text-accent">Made Easy.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
          The ultimate platform for solo travelers, groups, and digital nomads to organize, budget, and share their global adventures seamlessly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button asChild size="lg" className="rounded-full px-8 text-base">
            <Link to="/dashboard">
              Start Planning <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-base">
            <Link to="/search">Explore Destinations</Link>
          </Button>
        </div>
      </section>

      {/* Feature Section */}
      <section className="w-full py-20 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center px-4">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Enterprise-grade tools for your vacation</h2>
            <p className="text-muted-foreground text-lg">Everything you need from itinerary building to budget analytics.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass p-8 rounded-2xl flex flex-col items-start relative overflow-hidden group">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Interactive Itineraries</h3>
              <p className="text-muted-foreground">Drag and drop trip stops, select activities, and build a timeline that travels with you.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="glass p-8 rounded-2xl flex flex-col items-start relative overflow-hidden group">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Budget Analytics</h3>
              <p className="text-muted-foreground">Keep your expenses in check with daily cost breakdowns and visual budget alerts.</p>
            </div>

            {/* Feature 3 */}
            <div className="glass p-8 rounded-2xl flex flex-col items-start relative overflow-hidden group">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Seamless Sharing</h3>
              <p className="text-muted-foreground">Collaborate with friends or publish your trip publicly as an interactive read-only guide.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
