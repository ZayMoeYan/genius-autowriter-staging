import ContentGeneratorUi from '@/app/generator/components/content-generator-ui';
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import WithAuth from "@/app/HOC/WithAuth";


function Page() {

    return (
        <div className="min-h-screen bg-background text-foreground">

                <ContentGeneratorUi />

        </div>
    );
}

export default WithAuth(Page);

