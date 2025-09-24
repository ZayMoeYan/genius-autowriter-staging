"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/hooks/use-toast";
import { generateContentAction } from "@/app/actions";
import { Icons } from "./icons";

const formSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  purpose: z.string().min(1, "Please select a purpose."),
  audience: z.string().min(3, "Audience must be at least 3 characters long."),
  writingStyle: z.string().min(1, "Please select a writing style."),
  wordCount: z.number().min(50).max(2000),
  keywords: z.string().optional(),
  cta: z.string().optional(),
  negativeConstraints: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContentCrafterUI() {
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      purpose: "",
      audience: "",
      writingStyle: "",
      wordCount: 300,
      keywords: "",
      cta: "",
      negativeConstraints: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsGenerating(true);
    setGeneratedContent("");
    
    const result = await generateContentAction({
      ...values,
      keywords: values.keywords || '',
      cta: values.cta || '',
      negativeConstraints: values.negativeConstraints || '',
    });

    if (result.success && result.content) {
      setGeneratedContent(result.content);
      toast({
        title: "Content Generated!",
        description: "Your new content is ready for review.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: result.error || "An unknown error occurred.",
      });
    }
    setIsGenerating(false);
  };

  const handleSchedule = () => {
    if (!generatedContent) {
      toast({
        variant: "destructive",
        title: "Cannot Schedule",
        description: "Please generate content before scheduling.",
      });
      return;
    }
    if (!scheduleDate) {
      toast({
        variant: "destructive",
        title: "Cannot Schedule",
        description: "Please select a date to schedule.",
      });
      return;
    }
    toast({
      title: "Content Scheduled!",
      description: `Your post is scheduled for ${scheduleDate.toLocaleDateString('en-US', { dateStyle: 'long' })}.`,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
      <div className="space-y-8 p-6 md:p-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-headline font-semibold">Content Details</h2>
          <p className="text-muted-foreground">
            Provide the details for the content you want to generate in Myanmar.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., The benefits of mindfulness" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a purpose" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="inform">To Inform</SelectItem>
                        <SelectItem value="persuade">To Persuade</SelectItem>
                        <SelectItem value="entertain">To Entertain</SelectItem>
                        <SelectItem value="sell">To Sell</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="writingStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Writing Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="informal">Informal</SelectItem>
                        <SelectItem value="persuasive">Persuasive</SelectItem>
                        <SelectItem value="narrative">Narrative</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audience</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Young professionals, beginners" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wordCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Word Count: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={50}
                      max={2000}
                      step={50}
                      onValueChange={(value) => field.onChange(value[0])}
                      defaultValue={[field.value]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., meditation, stress relief, focus" {...field} />
                  </FormControl>
                  <FormDescription>Separate keywords with commas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call to Action (CTA)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sign up for our newsletter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="negativeConstraints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Negative Constraints</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Avoid technical jargon, don't mention competitors" {...field} />
                  </FormControl>
                  <FormDescription>Things the AI should not mention.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 !mt-8" size="lg" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div className="bg-muted/30 p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-headline font-semibold">Generated Content</h2>
          <p className="text-muted-foreground">
            Review, edit, and schedule your AI-generated content here.
          </p>
        </div>
        
        {isGenerating ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : generatedContent ? (
          <div className="space-y-6">
            <Textarea
              className="h-96 min-h-[24rem] text-base font-body"
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              placeholder="Your generated content will appear here..."
            />
            <div className="space-y-4 rounded-md border bg-background p-4">
              <h3 className="font-semibold font-headline">Schedule Publication</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <DatePicker date={scheduleDate} setDate={setScheduleDate} />
                <Button onClick={handleSchedule} className="w-full">
                  Schedule
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[50vh] rounded-lg border-2 border-dashed border-border/80 text-center p-4">
            <Wand2 className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Fill out the form to generate your content.</p>
          </div>
        )}
      </div>
    </div>
  );
}
