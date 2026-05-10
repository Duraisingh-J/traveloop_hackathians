import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Save, Clock, FileText, Trash2 } from 'lucide-react'

type Note = {
  id: string
  content: string
  timestamp: string
}

const initialNotes: Note[] = [
  { id: '1', content: 'Flight confirmation: XY892. Departing at 10:30 AM from Terminal 2.', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', content: 'Hotel check-in is at 3 PM. Remember to ask for a quiet room on a higher floor.', timestamp: new Date(Date.now() - 3600000).toISOString() }
]

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [currentNote, setCurrentNote] = useState('')

  const handleSave = () => {
    if (!currentNote.trim()) return
    
    const newNote = {
      id: crypto.randomUUID(),
      content: currentNote,
      timestamp: new Date().toISOString()
    }
    
    setNotes([newNote, ...notes])
    setCurrentNote('')
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Trip Journal & Notes</h2>
        <p className="text-muted-foreground mt-1">Jot down important details, booking references, or memories.</p>
      </div>

      <Card className="shadow-md border-accent/20">
        <CardContent className="p-0">
          <Textarea 
            placeholder="Write a new note..." 
            className="min-h-[150px] border-0 rounded-b-none focus-visible:ring-0 resize-none p-6 text-base bg-card/50"
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
          />
          <div className="bg-muted/30 p-4 border-t flex justify-end">
            <Button onClick={handleSave} disabled={!currentNote.trim()}>
              <Save className="mr-2 h-4 w-4" /> Save Note
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h3 className="font-semibold text-lg flex items-center">
          <FileText className="mr-2 h-5 w-5 text-accent" /> Saved Notes
        </h3>
        
        {notes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl bg-card">
            You haven't added any notes yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {notes.map(note => (
              <Card key={note.id} className="group relative bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <p className="text-foreground whitespace-pre-wrap">{note.content}</p>
                  <div className="mt-4 flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" /> {formatTime(note.timestamp)}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-4 right-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteNote(note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
