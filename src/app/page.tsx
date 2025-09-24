import ContentCrafterUI from '@/components/content-crafter-ui';
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/icons';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <Icons.logo className="h-10 w-10 text-primary" />
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-foreground">
            Content Crafter
          </h1>
        </header>
        <Card className="shadow-lg border-2 border-border/50 overflow-hidden">
          <CardContent className="p-0">
            <ContentCrafterUI />
          </CardContent>
        </Card>
        <footer className="text-center mt-8 text-sm text-muted-foreground">
          <p>Powered by AI. Designed for creators.</p>
        </footer>
      </div>
    </main>
  );
}
