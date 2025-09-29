"use client";

import {ChangeEvent, useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {Wand2, Upload, X, Sparkles} from "lucide-react";
import motLogo from '@/app/images/MOT.png';

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
import { useToast } from "@/hooks/use-toast";
import {generateContentAction, saveContent} from "@/app/actions/contentsAction";
import { Icons } from "@/components/icons";
import { buildMyanmarPrompt } from "@/utils/buildMyanmarPrompt";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dropzone} from "@/components/ui/Dropzone";

const formSchema = z.object({
    topic: z.string().min(3, "Topic must be at least 3 characters long."),
    purpose: z.string().min(1, "Please select a purpose."),
    audience: z.string().min(3, "Audience must be at least 3 characters long."),
    writingStyle: z.string().min(1, "Please select a writing style."),
    wordCount: z.number().min(50).max(2000),
    imageDescriptions: z.string().optional(),
    keywords: z.string().optional(),
    cta: z.string().optional(),
    negativeConstraints: z.string().optional(),
    hashtags: z.string().optional()
});

export type FormValues = z.infer<typeof formSchema>;

export default function ContentGeneratorUi() {

    const [generatedContent, setGeneratedContent] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [title, setTitle] = useState("");

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic: "",
            purpose: "",
            audience: "",
            writingStyle: "",
            wordCount: 300,
            imageDescriptions: "",
            keywords: "",
            cta: "",
            negativeConstraints: "",
            hashtags: ""
        },
    });

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
    };

    const onSubmit = async (values: FormValues) => {
        setIsGenerating(true);
        setGeneratedContent("");

        const base64Images = await Promise.all(
            uploadedImages.map(fileToBase64)
        );

        const prompt = buildMyanmarPrompt(values);

        try {
            const result = await generateContentAction(prompt, base64Images);
            setGeneratedContent(result.content);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

        setUploadedImages((prev) => [...prev, ...newFiles]);
        setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }

    const onSaveContent = async () => {
        try {
            const result = await saveContent(title, generatedContent);
            form.reset();
        } finally {
            setTitle("")
            setGeneratedContent("");
        }
    }

    const onTitleHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value)
    }

    return (
        <div className="min-h-screen bg-mot-gradient">

            <div className="bg-black/80 backdrop-blur-sm border-b border-primary/20">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">GENIUS AUTOWRITER</h1>
                            <p className="text-primary tracking-wider font-medium">AI-POWERED CONTENT CREATION</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="shadow-mot border-0 bg-white/95 backdrop-blur-sm">
                        <CardHeader className="space-y-2">
                            <CardTitle className="text-2xl text-secondary">Content Details</CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Provide the details for the content you want to generate in Myanmar.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="topic"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-secondary font-medium">Topic</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="ဒီနေရာတွင် Content ၏ အဓိကအကြောင်းအရာကို ရေးပါ"
                                                        {...field}
                                                        className="border-input focus:border-primary focus:ring-primary/20"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="purpose"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-secondary font-medium">Purpose</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="ဥပမာ - ပညာပေးရန်၊ Engagement ရရှိရန်၊ ရောင်းအားမြှင့်တင်ရန်"
                                                        {...field}
                                                        className="border-input focus:border-primary focus:ring-primary/20"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="writingStyle"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-secondary font-medium">Writing Style/Tone</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="border-input focus:border-primary focus:ring-primary/20">
                                                            <SelectValue placeholder="Tone ကိုရွေးချယ်ပါ" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="ပျော်ရွှင်စရာနှင့် အားတက်ဖွယ်">ပျော်ရွှင်စရာနှင့် အားတက်ဖွယ်</SelectItem>
                                                        <SelectItem value="ပညာရှင်ဆန်ဆန်နှင့် ယုံကြည်မှုရှိသော">ပညာရှင်ဆန်ဆန်နှင့် ယုံကြည်မှုရှိသော</SelectItem>
                                                        <SelectItem value="ရင်းနှီးဖော်ရွေသော">ရင်းနှီးဖော်ရွေသော</SelectItem>
                                                        <SelectItem value="ဟာသဉာဏ်ပါသော">ဟာသဉာဏ်ပါသော</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="audience"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-secondary font-medium">Audience</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="ဥပမာ - အသက် ၂၀ မှ ၃၀ ကြား လူငယ်တွေ"
                                                        {...field}
                                                        className="border-input focus:border-primary focus:ring-primary/20"
                                                    />
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
                                                <FormLabel className="text-secondary font-medium">Word Count: {field.value}</FormLabel>
                                                <FormControl>
                                                    <Slider
                                                        min={50}
                                                        max={2000}
                                                        step={50}
                                                        onValueChange={(value) => field.onChange(value[0])}
                                                        defaultValue={[field.value]}
                                                        className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormItem>
                                        <FormLabel className="text-gray-700">Upload Image</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Dropzone
                                                    onChange={handleFileChange}
                                                    onFilesAccepted={(files: File[]) => {
                                                        setUploadedImages((prev) => [...prev, ...files]);
                                                        setPreviewUrls((prev) => [
                                                            ...prev,
                                                            ...files.map((file) => URL.createObjectURL(file)),
                                                        ]);
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>

                                    {previewUrls.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {previewUrls.map((url, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={url}
                                                        alt={`Uploaded preview ${index + 1}`}
                                                        className="rounded-lg border shadow-sm object-cover w-full h-24"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setUploadedImages((prev) => prev.filter((_, i) => i !== index));
                                                            setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
                                                        }}
                                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <FormField
                                        control={form.control}
                                        name="imageDescriptions"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-secondary font-medium">Image Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="image ကဘာအကြောင်းအရာနဲ့ပတ်သက်တာလဲဆိုတဲ့အကြောင်းအရာအနှစ်ချုပ်"
                                                        {...field}
                                                        className="border-input focus:border-primary focus:ring-primary/20"
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
                                                <FormLabel className="text-secondary font-medium">Keywords</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="ဥပမာ - Digital Marketing မြန်မာ၊ အွန်လိုင်းစီးပွားရေး၊ Content Creation"
                                                        {...field}
                                                        className="border-input focus:border-primary focus:ring-primary/20"
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-muted-foreground">Separate keywords with commas.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="hashtags"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-secondary font-medium">Hashtags</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="ဥပမာ - #DigitalMarketingMyanmar #OnlineBusinessTips"
                                                        {...field}
                                                        className="border-input focus:border-primary focus:ring-primary/20"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="cta"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-secondary font-medium">Call to Action (CTA)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="ဥပမာ - ပိုမိုသိရှိလိုပါက Page ကို Message ပို့လိုက်ပါ၊ သင့်အမြင်ကို Comment မှာ ရေးခဲ့ပါ"
                                                        {...field}
                                                        className="border-input focus:border-primary focus:ring-primary/20"
                                                    />
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
                                                <FormLabel className="text-secondary font-medium">Negative Constraints</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="ဥပမာ - ဈေးနှုန်းအကြောင်း မထည့်ရ၊ ပြိုင်ဘက်ကို တိုက်ရိုက်မဖော်ပြရ၊ အပျက်သဘောဆောင်သော စကားလုံးများ မသုံးရ"
                                                        {...field}
                                                        className="border-input focus:border-primary focus:ring-primary/20"
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-muted-foreground">Things the AI should not mention.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-mot-red font-medium"
                                        size="lg"
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
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
                        </CardContent>
                    </Card>

                    <Card className="shadow-mot border-0 bg-secondary/95 backdrop-blur-sm">
                        <CardHeader className="space-y-2">
                            <CardTitle className="text-2xl text-white">Generated Content</CardTitle>
                            <CardDescription className="text-primary">
                                Review and edit your AI-generated content here.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isGenerating ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-8 w-3/4 bg-white/20" />
                                    <Skeleton className="h-4 w-full bg-white/20" />
                                    <Skeleton className="h-4 w-full bg-white/20" />
                                    <Skeleton className="h-4 w-5/6 bg-white/20" />
                                    <Skeleton className="h-4 w-full bg-white/20" />
                                    <Skeleton className="h-4 w-full bg-white/20" />
                                    <Skeleton className="h-4 w-full bg-white/20" />
                                    <Skeleton className="h-4 w-2/3 bg-white/20" />
                                </div>
                            ) : generatedContent ? (
                                <div className="space-y-6">
                                    <Textarea
                                        className="h-96 min-h-[24rem] bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary focus:ring-primary/20"
                                        value={generatedContent}
                                        onChange={(e) => setGeneratedContent(e.target.value)}
                                        placeholder="Your generated content will appear here..."
                                    />
                                    <div>
                                        <label htmlFor="title" className="block text-white mb-2 font-medium">Title of content</label>
                                        <Input
                                            id="title"
                                            value={title}
                                            onChange={onTitleHandler}
                                            placeholder="ဥပမာ - Digital Marketing"
                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary focus:ring-primary/20"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-mot-red font-medium"
                                        size="lg"
                                        onClick={onSaveContent}
                                    >
                                        Save Content
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[70vh] rounded-lg border-2 border-dashed border-primary/50 text-center p-8">
                                    <Wand2 className="h-16 w-16 text-primary mb-4" />
                                    <p className="text-primary text-lg font-medium">Fill out the form to generate your content.</p>
                                    <p className="text-white/70 mt-2">Your AI-powered content will appear here</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}