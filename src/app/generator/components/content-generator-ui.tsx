"use client";

import {ChangeEvent, useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {Wand2, Upload, X, Sparkles, ChevronsUpDown, Check} from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
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
import { buildMyanmarPrompt } from "@/utils/buildMyanmarPrompt";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dropzone} from "@/components/ui/Dropzone";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    topic: z.string().min(3, "Content ရဲ့ အဓိက အကြာင်းအရာကို ရေးသားပေးပါ"),
    purpose: z.string().min(1, "Content ရဲ့ ရည်ရွယ်ချက် ကိုရေးသားပေးပါ"),
    audience: z.string().min(3, "Target Audience ကိုရေးသားပေးပါ"),
    writingStyle: z.array(z.string())
        .min(1, "Writing Style / Tone ကို တစ်ခုအနည်းဆုံးရွေးပေးပါ")
        .max(3, "၃ ခုအထိများဆုံးရွေးချယ်နိုင်ပါတယ်"),
    outputLanguage: z.string(),
    copyWritingModel: z.string(),
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
    const [isSaving, setIsSaving] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [title, setTitle] = useState("");
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic: "",
            purpose: "",
            audience: "",
            writingStyle: [],
            outputLanguage: "",
            copyWritingModel: "",
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
        setIsSaving(true);
        try {
            const result = await saveContent(title, generatedContent);
            form.reset();

            toast({
                title: "✅ Content Created",
                description: "Your content has been successfully saved.",
            });
        } catch (error) {
            toast({
                title: "❌ Error",
                description: "Failed to save content. Please try again.",
            });
        } finally {
            setTitle("");
            setGeneratedContent("");
            setIsSaving(false);
        }
    }

    const onTitleHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20">

            <div className="bg-black/80 backdrop-blur-sm border-b border-primary/20 border-red-800 border-[0.5px] rounded-xl mt-10 mx-20">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">GENIUS AUTOWRITER</h1>
                            <p className="text-primary tracking-wider font-medium">CONTENT CREATION</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl   border-red-800 border-[0.5px] rounded-xl mx-20 mt-10">
                <div className="flex flex-col gap-8">
                    <Card className="shadow-mot border-0  backdrop-blur-sm bg-black ">
                        <CardHeader className="space-y-2">
                            <CardTitle className="text-3xl font-bold text-white">Content Details Form</CardTitle>
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
                                            <FormItem className={'flex-1'} >
                                                <FormLabel className="text-white font-bold text-[1.2rem]">Topic</FormLabel>
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

                                    <div className={'flex flex-row gap-3'} >
                                        <FormField
                                            control={form.control}
                                            name="purpose"
                                            render={({ field }) => (
                                                <FormItem className={'flex-1'} >
                                                    <FormLabel className="text-white font-bold text-[1.2rem]">Purpose</FormLabel>
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
                                            name="audience"
                                            render={({ field }) => (
                                                <FormItem className={'flex-1'} >
                                                    <FormLabel className="text-white font-bold text-[1.2rem]">Audience</FormLabel>
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
                                    </div>

                                    <div className={'flex flex-row gap-3'} >
                                        <FormField
                                            control={form.control}
                                            name="copyWritingModel"
                                            render={({ field }) => (
                                                <FormItem className={'flex-1'} >
                                                    <FormLabel className="text-white font-bold text-[1.2rem]">CopyWriting Model</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="border-input focus:border-primary focus:ring-primary/20">
                                                                <SelectValue placeholder="CopyWriting Model ကိုရွေးချယ်ပါ" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="AIDA (Attention, Interest, Desire, Action)">AIDA (Attention, Interest, Desire, Action)</SelectItem>
                                                            <SelectItem value="PAS (Problem, Agitate, Solution)">PAS (Problem, Agitate, Solution)</SelectItem>
                                                            <SelectItem value="FAB (Features, Advantages, Benefits)">FAB (Features, Advantages, Benefits)</SelectItem>
                                                            <SelectItem value="The 4 P's (Picture, Promise, Prove, Push)">The 4 P's (Picture, Promise, Prove, Push)</SelectItem>
                                                            <SelectItem value="BAB (Before, After, Bridge)">BAB (Before, After, Bridge)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />


                                        <FormField
                                            control={form.control}
                                            name="outputLanguage"
                                            render={({ field }) => (
                                                <FormItem className={'flex-1'} >
                                                    <FormLabel className="text-white font-bold text-[1.2rem]">Output Language</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="border-input focus:border-primary focus:ring-primary/20">
                                                                <SelectValue placeholder="Output Language ကိုရွေးချယ်ပါ" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="မြန်မာ">မြန်မာ (Myanmar)</SelectItem>
                                                            <SelectItem value="English">အင်္ဂလိပ် (English)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="writingStyle"
                                        render={({ field }) => (
                                            <FormItem >
                                                <FormLabel className="text-white font-bold text-[1.2rem]">Writing Style / Tone (အများဆုံ ၃ ခုအထိရွေးချယ်နိုင်ပါသည်)</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className="w-full justify-between border-input focus:border-primary focus:ring-primary/20 hover:bg-white hover:text-black"
                                                        >
                                                            {field.value && field.value.length > 0
                                                                ? field.value.join(", ")
                                                                : "Writing Style / Tone ကိုရွေးချယ်ပါ"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] ">
                                                        <Command className={'w-full'} >
                                                            {/*<CommandInput placeholder="Search tone..."  />*/}
                                                            {/*<CommandEmpty>No tone found.</CommandEmpty>*/}
                                                            <CommandGroup>
                                                                {[
                                                                    "ဖော်ရွေသော (Friendly)",
                                                                    "တရားဝင် (Formal)",
                                                                    "ဟာသ (Humorous)",
                                                                    "ယုံကြည်မှုရှိသော (Confident)",
                                                                    "စိတ်အားထက်သန်သော (Enthusiastic)",
                                                                    "ပရော်ဖက်ရှင်နယ် (Professional)",
                                                                    "စကားပြောပုံစံ (Conversational)",
                                                                    "ဇာတ်လမ်းပြောပုံစံ (Narrative)",
                                                                    "အသိပေးရှင်းပြပုံစံ (Expository)",
                                                                    "စည်းရုံးဆွဲဆောင်ပုံစံ (Persuasive)"
                                                                ].map((style) => {
                                                                    const isSelected = field.value?.includes(style);
                                                                    return (
                                                                        <CommandItem
                                                                            key={style}
                                                                            onSelect={() => {

                                                                                const myanmarOnly = style.split("(")[0].trim();

                                                                                let newValue = field.value || [];
                                                                                if (newValue.includes(myanmarOnly)) {
                                                                                    newValue = newValue.filter((s) => s !== myanmarOnly);
                                                                                } else if (newValue.length < 3) {
                                                                                    newValue = [...newValue, myanmarOnly];
                                                                                }
                                                                                field.onChange(newValue);
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    field.value?.includes(style.split("(")[0].trim())
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {style}
                                                                        </CommandItem>
                                                                    );
                                                                })}
                                                            </CommandGroup>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />


                                    <FormField
                                        control={form.control}
                                        name="wordCount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-white font-bold text-[1.2rem]">Word Count: {field.value}</FormLabel>
                                                <FormControl>
                                                    <Slider
                                                        min={100}
                                                        max={1000}
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
                                        <FormLabel className="text-white font-bold text-[1.2rem]">Upload Image</FormLabel>
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
                                                        className="rounded-lg border shadow-sm object-cover w-full"
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
                                                <FormLabel className="text-white font-bold text-[1.2rem]">Image Description</FormLabel>
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
                                                <FormLabel className="text-white font-bold text-[1.2rem]">Keywords</FormLabel>
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
                                                <FormLabel className="text-white font-bold text-[1.2rem]">Hashtags</FormLabel>
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
                                                <FormLabel className="text-white font-bold text-[1.2rem]">Call to Action (CTA)</FormLabel>
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
                                                <FormLabel className="text-white font-bold text-[1.2rem]">Negative Constraints</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="ဥပမာ - ဈေးနှုန်းအကြောင်း မထည့်ရ၊ ပြိုင်ဘက်ကို တိုက်ရိုက်မဖော်ပြရ၊ အပျက်သဘောဆောင်သော စကားလုံးများ မသုံးရ"
                                                        {...field}
                                                        className="border-input focus:border-primary focus:ring-primary/20"
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-muted-foreground">Things that content should not include.</FormDescription>
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
                </div>
            </div>
            <Card className="shadow-mot backdrop-blur-sm bg-black border-red-800 border-[0.5px] mx-20 mt-10 mb-10 rounded-xl">
                <CardHeader className="space-y-2 ">
                    <CardTitle className="text-white font-bold text-3xl">Generated Content</CardTitle>
                    <CardDescription className="text-primary">
                        Review and edit your generated content here.
                    </CardDescription>
                </CardHeader>
                <CardContent >
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
                                className="h-96 min-h-[24rem]  bg-white border-white/20 text-black  placeholder:text-white/50 focus:border-primary focus:ring-primary/20"
                                value={generatedContent}
                                onChange={(e) => setGeneratedContent(e.target.value)}
                                placeholder="Your generated content will appear here..."
                            />
                            <div>
                                <label htmlFor="title" className="text-white text-[1.2rem]">Title of content</label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={onTitleHandler}
                                    placeholder="ဥပမာ - Digital Marketing"
                                    className="bg-white border-black/20 mt-2  placeholder:text-white/50 focus:border-primary"
                                />
                            </div>
                            <Button
                                type="button"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-mot-red font-medium"
                                size="lg"
                                onClick={onSaveContent}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Content"
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col h-[50vh]  items-center justify-center rounded-lg border-2 border-dashed border-primary/50 text-center p-8">
                            <Wand2 className="h-16 w-16 text-primary mb-4" />
                            <p className="text-primary text-lg font-medium">Fill out the form to generate your content.</p>
                            <p className="text-white/70 mt-2">Your content will appear here</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}