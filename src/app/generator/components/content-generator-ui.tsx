"use client";

import {ChangeEvent, useEffect, useRef, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {Wand2, X, Sparkles, SaveIcon} from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {generateContentAction, saveContent} from "@/app/actions/contentsAction";
import { buildPrompt } from "@/utils/buildPrompt";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dropzone} from "@/components/ui/Dropzone";
import {useAuth} from "@/app/context/AuthProvider";
import {getLoginUser} from "@/app/actions/getLoginUser";
import {CurrentUserType} from "@/components/Nav";
import getApikey from "@/app/actions/getApikey";
import { useTranslation } from "next-i18next";

const formSchema = z.object({
    topic: z.string().min(3, ""),
    purpose: z.string().min(1, ""),
    audience: z.string().min(3, ""),
    writingStyle: z.string().min(1, ""),
    outputLanguage: z.string().min(1, ""),
    contentLength: z.string().min(1, ""),
    imageDescriptions: z.array(z.string().optional()).optional(),
    keywords: z.string().optional(),
    negativeConstraints: z.string().optional(),
    hashtags: z.string().optional(),
    emoji: z.boolean().default(false),
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

    // @ts-ignore
    const { currentUser, setCurrentUser } = useAuth<CurrentUserType>();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (!currentUser) {
            getLoginUser().then((user) => {
                if (user) { // @ts-ignore
                    setCurrentUser(user);
                }
            });
        }
    }, [currentUser, setCurrentUser]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic: "",
            purpose: "",
            audience: "",
            writingStyle: "",
            outputLanguage: "",
            contentLength: "",
            imageDescriptions: [],
            keywords: "",
            negativeConstraints: "",
            hashtags: "",
            emoji: false,
        },
    });

    const { control, handleSubmit, register } = form;
    const {
        fields: imageFields,
        append: appendImage,
        remove: removeImage,
    } = useFieldArray({
        control,
        // @ts-ignore
        name: "imageDescriptions",
    });

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

        setUploadedImages((prev) => [...prev, ...newFiles]);
        setPreviewUrls((prev) => [...prev, ...newPreviews]);
        // @ts-ignore
        newFiles.forEach(() => appendImage(""));
    };

    const onSubmit = async (values: FormValues) => {
        setIsGenerating(true);
        setGeneratedContent("");

        const base64Images = await Promise.all(uploadedImages.map(fileToBase64));

        try {

            const apikey = await getApikey();
            const prompt = buildPrompt(values);

            //@ts-ignore
            const result = await generateContentAction(prompt, base64Images, apikey!);

            setGeneratedContent(result.content);
            toast({
              title: t("success"),
              description: t("successGenerated"),
              status: "success",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const onSaveContent = async () => {
        setIsSaving(true);
        try {
            const result = await saveContent(title, generatedContent);
            form.reset();
            setUploadedImages([]);

            toast({
                title: t("success"),
                description: t("successSaved"),
                status: "success",
            })
        } catch (error) {
            toast({
                title: t("error"),
                description: t("errorSaving"),
                status: "error",
            })
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

            {/* Header */}
            <div className="bg-black/80 backdrop-blur-sm border-b border-primary/20 border-red-800 border-[0.5px] rounded-xl mt-10 lg:mx-20 md:mx-10 mx-5 ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">GENIUS AUTOWRITER</h1>
                            <p className="text-primary tracking-wider font-medium text-sm sm:text-base">{t("contentCreation")}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl border-red-800 border-[0.5px] rounded-xl lg:mx-20 md:mx-10 mx-5  mt-10">
                <div className="flex flex-col gap-8">
                    <Card className="shadow-mot border-0 backdrop-blur-sm bg-black">
                        <CardHeader className="space-y-2">
                            <CardTitle className={`font-bold text-white ${i18n.language === "mm" ? "text-2xl" : "text-2xl sm:text-3xl "}`}>{t("contentDetailsForm")}</CardTitle>
                            <CardDescription className="text-muted-foreground">
                                {t("contentDetailsDescription")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                                    <div className={'relative'} >
                                        <FormField
                                            control={form.control}
                                            name="topic"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel className="text-white font-bold text-lg sm:text-[1.2rem]">{t('topic')} <span className={'text-red-600'} >*</span></FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder={t("topicPlaceholder")}
                                                            {...field}
                                                            className="border-none"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        {form.formState.errors.topic && <FormMessage className={'absolute mt-2  text-red-600 text-sm'} >{t("formErrors.topic")}</FormMessage> }
                                    </div>


                                    <div className="flex flex-col md:flex-row gap-3 md:gap-6">
                                        <div className={'relative flex-1'} >
                                            <FormField
                                                control={form.control}
                                                name="purpose"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-white font-bold text-lg sm:text-[1.2rem]">{t('purpose')} <span className={'text-red-600'} >*</span></FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder={t("purposePlaceholder")}
                                                                {...field}
                                                                className="border-none"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {form.formState.errors.purpose && <p className={'mt-2 absolute text-red-600 text-sm'} >{t("formErrors.purpose")}</p> }
                                        </div>

                                        <div className={'relative flex-1'} >
                                            <FormField
                                                control={form.control}
                                                name="audience"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-white font-bold text-lg sm:text-[1.2rem]">{t("audience")} <span className={'text-red-600'} >*</span></FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder={t("audiencePlaceholder")}
                                                                {...field}
                                                                className="border-none"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {form.formState.errors.audience && <p className={'mt-2 absolute text-red-600 text-sm'} >{t("formErrors.audience")}</p> }
                                        </div>


                                    </div>

                                    <div className="flex flex-col md:flex-row gap-3 md:gap-6">
                                        <div className={'relative flex-1'} >
                                            <FormField
                                                control={form.control}
                                                name="writingStyle"
                                                render={({ field }) => (
                                                    <FormItem >
                                                        <FormLabel className="text-white font-bold text-[1.2rem]">{t("writingStyle")} <span className={'text-red-600'} >*</span></FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="border-input focus:border-primary focus:ring-primary/20">
                                                                    <SelectValue placeholder={t("writingStylePlaceholder")} />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="ဖော်ရွေသော(friendly)">{t("writingStyleOptions.friendly")}</SelectItem>
                                                                <SelectItem value="တရားဝင်(formal)">{t("writingStyleOptions.formal")}</SelectItem>
                                                                <SelectItem value="ဟာသ(humorous)">{t("writingStyleOptions.humorous")}</SelectItem>
                                                                <SelectItem value="ယုံကြည်မှုရှိသော(confident)">{t("writingStyleOptions.confident")}</SelectItem>
                                                                <SelectItem value="စိတ်အားထက်သန်သော(motivational)">{t("writingStyleOptions.motivational")}</SelectItem>
                                                                <SelectItem value="ပရော်ဖက်ရှင်နယ်(professional)">{t("writingStyleOptions.professional")}</SelectItem>
                                                                <SelectItem value="စကားပြောပုံစံ(conversational)">{t("writingStyleOptions.conversational")}</SelectItem>
                                                                <SelectItem value="ဇာတ်လမ်းပြောပုံစံ(storytelling)">{t("writingStyleOptions.storytelling")}</SelectItem>
                                                                <SelectItem value="အသိပေးရှင်းပြပုံစံ(informative)">{t("writingStyleOptions.informative")}</SelectItem>
                                                                <SelectItem value="စည်းရုံးဆွဲဆောင်ပုံစံ(persuasive)">{t("writingStyleOptions.persuasive")}</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {form.formState.errors.writingStyle && <p className={'mt-2 absolute text-red-600 text-sm'} >{t("formErrors.writingStyle")}</p> }
                                        </div>

                                        <div className={'relative flex-1'} >
                                            <FormField
                                                control={form.control}
                                                name="contentLength"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-white font-bold text-lg sm:text-[1.2rem]">{t("contentLength")} <span className={'text-red-600'} >*</span></FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="border-input focus:border-primary focus:ring-primary/20">
                                                                    <SelectValue placeholder={t("contentLengthPlaceholder")} />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="short">{t("contentLengthOptions.short")}</SelectItem>
                                                                <SelectItem value="medium">{t("contentLengthOptions.medium")}</SelectItem>
                                                                <SelectItem value="long">{t("contentLengthOptions.long")}</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {form.formState.errors.contentLength && <p className={'mt-2 absolute text-red-600 text-sm'} >{t("formErrors.contentLength")}</p> }
                                        </div>

                                        <div className={'relative flex-1'} >
                                            <FormField
                                                control={form.control}
                                                name="outputLanguage"
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel className="text-white font-bold text-lg sm:text-[1.2rem]">{t("outputLanguage")} <span className={'text-red-600'} >*</span></FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="border-input focus:border-primary focus:ring-primary/20">
                                                                    <SelectValue placeholder={t("outputLanguagePlaceholder")}/>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="မြန်မာ">{t("outputLanguageOptions.myanmar")}</SelectItem>
                                                                <SelectItem value="English">{t("outputLanguageOptions.english")}</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {form.formState.errors.outputLanguage && <p className={'mt-2 absolute text-red-600 text-sm'} >{t("formErrors.outputLanguage")}</p> }
                                        </div>
                                    </div>

                                    <FormItem>
                                        <FormLabel className="text-white font-bold text-[1.2rem]">
                                            {t("uploadImage")}
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Dropzone
                                                    onChange={handleFileChange}
                                                    onFilesAccepted={(files: File[]) => {
                                                        setUploadedImages((prev) => [...prev, ...files]);
                                                        setPreviewUrls((prev) => [
                                                            ...prev,
                                                            ...files.map((f) => URL.createObjectURL(f)),
                                                        ]);
                                                        // @ts-ignore
                                                        files.forEach(() => appendImage(""));
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>

                                    {previewUrls.length > 0 && (
                                        <div className="flex flex-wrap gap-4 mt-4">
                                            {previewUrls.map((url, index) => (
                                                <div key={index} className="relative w-[240px]">
                                                    <div className="aspect-square overflow-hidden rounded-lg border shadow-sm bg-gray-100 flex items-center justify-center">
                                                        <img
                                                            src={url}
                                                            alt={`Uploaded preview ${index + 1}`}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setUploadedImages((prev) =>
                                                                prev.filter((_, i) => i !== index)
                                                            );
                                                            setPreviewUrls((prev) =>
                                                                prev.filter((_, i) => i !== index)
                                                            );
                                                            removeImage(index);
                                                        }}
                                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>

                                                    <div className="mt-2">
                                                        <Textarea
                                                            placeholder={`Image ${index + 1} description...`}
                                                            {...register(`imageDescriptions.${index}`)}
                                                            className="border-input focus:border-primary focus:ring-primary/20 text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex flex-col md:flex-row gap-3 md:gap-6">

                                        <FormField
                                            control={form.control}
                                            name="hashtags"
                                            render={({ field }) => (
                                                <FormItem className={'flex-1'} >
                                                    <FormLabel className="text-white font-bold text-[1.2rem]">{t("hashtags")}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder={t("hashtagsPlaceholder")}
                                                            {...field}
                                                            className="border-none"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                    <FormDescription className="text-muted-foreground">{t("hashtagsDescription")}</FormDescription>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="negativeConstraints"
                                            render={({ field }) => (
                                                <FormItem className={'flex-1'} >
                                                    <FormLabel className="text-white font-bold text-[1.2rem]">{t("negativeConstraints")}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder={t("negativeConstraintsPlaceholder")}
                                                            {...field}
                                                            className="border-none"
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="text-muted-foreground">{t("negativeConstraintsDescription")}</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="emoji"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between p-3 border-[0.2px] border-red-600 rounded-xl">
                                                <FormLabel className="text-white font-bold text-lg sm:text-[1.2rem]">
                                                    {t("includeEmojis")}
                                                </FormLabel>
                                                <FormControl>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.value}
                                                            onChange={(e) => field.onChange(e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div
                                                            className={`w-11 h-6 rounded-full transition-colors duration-300 
                                                                        ${field.value ? "bg-green-500" : "bg-gray-400"}`}
                                                        >
                                                            <div
                                                                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300
                                                                           ${field.value ? "translate-x-5" : "translate-x-0"}`}
                                                            ></div>
                                                        </div>
                                                    </label>
                                                </FormControl>
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
                                                {t("generating")}
                                            </>
                                        ) : (
                                            <>
                                                <Wand2 className="mr-2 h-4 w-4" />
                                                {t("generateContent")}
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card className="shadow-mot backdrop-blur-sm bg-black border-red-800 border-[0.5px] lg:mx-20 md:mx-10 mx-5 mt-10 rounded-xl">
                <CardHeader className="space-y-2 ">
                    <CardTitle className={`text-white font-bold ${i18n.language === "mm" ? "text-2xl" : "text-3xl"}`} > {t("generatedContent")}</CardTitle>
                    <CardDescription className="text-primary">
                        {t("generatedContentDescription")}
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
                                disabled={isSaving}
                                onChange={(e) => setGeneratedContent(e.target.value)}
                                placeholder="Your generated content will appear here..."
                            />
                            <div>
                                <label htmlFor="title" className="text-white text-[1.2rem]">{t("titleOfContent")}</label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={onTitleHandler}
                                    placeholder={t("titlePlaceholder")}
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
                                        {t("saving")}
                                    </>
                                ) : (
                                    t("saveContent")
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col h-[50vh]  items-center justify-center rounded-lg border-2 border-dashed border-primary/50 text-center p-8">
                            <Wand2 className="h-16 w-16 text-primary mb-4" />
                            <p className="text-primary text-lg font-medium">{t("emptyStateTitle")}</p>
                            <p className="text-white/70 mt-2">{t("emptyStateDescription")}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}