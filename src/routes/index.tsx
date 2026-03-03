import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="space-y-6">
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">Beta</Badge>
            <Badge variant="outline">TanStack Start</Badge>
          </div>
          <CardTitle className="text-3xl">Welcome to Benben</CardTitle>
          <CardDescription>
            A modern reading app built with TanStack Router + shadcn/ui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button>Get Started</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: '📚 Reading', desc: 'Interactive articles with audio' },
          { title: '🎯 Vocabulary', desc: 'Tap words for translations' },
          { title: '🏆 Rewards', desc: 'Earn coins while learning' },
        ].map((feature) => (
          <Card key={feature.title} className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
              <CardDescription>{feature.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
