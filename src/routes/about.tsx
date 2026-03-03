import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/about')({
  component: AboutComponent,
})

function AboutComponent() {
  const techStack = [
    { name: 'TanStack Router', desc: 'Type-safe routing for React', tag: 'Routing' },
    { name: 'TanStack Query', desc: 'Powerful async state management', tag: 'Data' },
    { name: 'Tailwind CSS', desc: 'Utility-first CSS framework', tag: 'Styling' },
    { name: 'shadcn/ui', desc: 'Beautiful component library', tag: 'UI' },
    { name: 'Vinxi', desc: 'Universal development server', tag: 'Dev' },
    { name: 'Supabase', desc: 'PostgreSQL database + Auth', tag: 'Backend' },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">About Benben</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          An interactive reading application designed for young learners,
          built with modern web technologies.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>
            Built with the best tools in the React ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {techStack.map((tech) => (
              <div 
                key={tech.name} 
                className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div>
                  <h3 className="font-semibold">{tech.name}</h3>
                  <p className="text-sm text-muted-foreground">{tech.desc}</p>
                </div>
                <Badge variant="outline">{tech.tag}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About the Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Benben is designed to make reading fun and engaging for children.
            With interactive features like tap-to-translate vocabulary,
            audio narration, and a rewarding coin system, kids stay motivated
            to read more every day.
          </p>
          <div className="flex items-center gap-2 pt-4 border-t">
            <span className="text-sm text-muted-foreground">Version 1.0.0</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">Built with ❤️ by BearLabs</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
