import { create } from 'zustand'

export type TripStop = {
  id: string
  city: string
  order: number
  startDate?: string
  endDate?: string
}

interface TripState {
  tripName: string
  description: string
  startDate: string
  endDate: string
  stops: TripStop[]
  setTripDetails: (details: Partial<Omit<TripState, 'stops' | 'setTripDetails' | 'addStop' | 'reorderStops' | 'removeStop'>>) => void
  addStop: (stop: Omit<TripStop, 'id' | 'order'>) => void
  reorderStops: (startIndex: number, endIndex: number) => void
  removeStop: (id: string) => void
}

export const useTripStore = create<TripState>((set) => ({
  tripName: '',
  description: '',
  startDate: '',
  endDate: '',
  stops: [],
  setTripDetails: (details) => set((state) => ({ ...state, ...details })),
  addStop: (stop) => set((state) => ({
    stops: [
      ...state.stops,
      {
        ...stop,
        id: crypto.randomUUID(),
        order: state.stops.length,
      }
    ]
  })),
  reorderStops: (startIndex, endIndex) => set((state) => {
    const result = Array.from(state.stops)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    
    // Update order property
    const reordered = result.map((stop, index) => ({
      ...stop,
      order: index
    }))
    
    return { stops: reordered }
  }),
  removeStop: (id) => set((state) => {
    const filtered = state.stops.filter((stop) => stop.id !== id)
    const reordered = filtered.map((stop, index) => ({
      ...stop,
      order: index
    }))
    return { stops: reordered }
  })
}))
