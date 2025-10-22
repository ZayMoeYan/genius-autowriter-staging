'use client';
import React, {useState, useRef, useEffect, ChangeEvent} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {Dropzone} from "@/components/ui/Dropzone";
import {Copy, Mic, Sparkles, StopCircle, Wand2, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {useToast} from "@/hooks/use-toast";
import {useTranslation} from "next-i18next";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {saveContent} from "@/app/actions/contentsAction";
import {FormValues} from "@/app/generator/components/content-generator-ui";
import * as z from "zod";
import {sendToGemini} from "@/app/actions/voiceGenerateAction";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useAuthStore} from "@/stores/useAuthStore";
import {updateTrialGeneratedCount} from "@/app/actions/usersAction";

const formSchema = z.object({
    title: z.string().min(1, ""),
    imageDescriptions: z.array(z.string().optional()).optional(),
    emoji: z.boolean().default(false),
});

export default function VoiceChatDemo() {
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [generatedContent, setGeneratedContent] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const [base64audio, setBase64Audio] = useState("");
    const [title, setTitle] = useState("");
    const { t, i18n } = useTranslation();
    const [audioSaved, setAudioSaved] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pageName, setPageName] = useState("");

    const { currentUser, refreshUser } = useAuthStore();

    const form = useForm<FormValues>({
        // @ts-ignore
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            imageDescriptions: [],
            emoji: false
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
    })

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        // @ts-ignore
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e: any) => {
            if (e.data.size > 0) { // @ts-ignore
                audioChunksRef.current.push(e.data);
            }
        };

        mediaRecorder.onstop = handleRecordingStop;
        mediaRecorder.start();
        setRecording(true);
        setAudioSaved(false)
        setSeconds(0);

        timerRef.current = setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);
    };

    const stopRecording = () => {
        setAudioSaved(true)
        // @ts-ignore
        const mediaRecorder = mediaRecorderRef.current;
        if (mediaRecorder) {
            // @ts-ignore
            mediaRecorder.stop();
        }

        // @ts-ignore
        if (mediaRecorder?.stream) {
            // @ts-ignore
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }

        setRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (mediaRecorderRef.current) {
                // @ts-ignore
                mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const arrayBufferToBase64 = (buffer: any) => {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    const handleRecordingStop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const arrayBuffer = await audioBlob.arrayBuffer();
        const base64Audio = arrayBufferToBase64(arrayBuffer);

        setBase64Audio(base64Audio)
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(generatedContent);
            toast({
                title: t("viewModal.copy_success"),
                description: t("viewModal.copy_success_desc"),
                status: "success",
            })
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

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

        if (!currentUser?.generatedCount) {
            toast({
                title: t("error"),
                description: t("trialErrorGenerated"),
                status: "error",
            });
            return
        }

        setIsGenerating(true);
        setGeneratedContent("");

        const base64Images = await Promise.all(uploadedImages.map(fileToBase64));

        try {

            const result = await sendToGemini(base64Images, base64audio, values);
            if(currentUser.role === "TRIAL") {
                // @ts-ignore
                await updateTrialGeneratedCount(currentUser?.id);
            }

            // @ts-ignore
            setGeneratedContent(result)

            await refreshUser();

            toast({
                title: t("success"),
                description: t("successGenerated"),
                status: "success",
            });

        } catch {
            toast({
                title: t("error"),
                description: t("errorGenerated"),
                status: "error",
            });
        } finally{
            setIsGenerating(false);
            setAudioSaved(false)
        }
    };

    const onSaveContent = async () => {
        setIsSaving(true);
        try {
            const result = await saveContent(form.getValues().title, generatedContent);
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
            setPreviewUrls([])
            setTitle("");
            setGeneratedContent("");
            setBase64Audio("")
            setIsSaving(false);
            setIsModalOpen(false)
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
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem className={'flex-1'} >
                                                    <FormLabel className="text-white font-bold text-[1.2rem]">{t("pageName")} <span className={'text-red-600'} >*</span></FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={isGenerating}
                                                            placeholder={t("pageNamePlaceholder")}
                                                            {...field}
                                                            className="border-none font-semibold"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {form.formState.errors.title && <FormMessage className={'absolute mt-1  text-red-600 text-sm'} >{t("formErrors.pageName")}</FormMessage> }
                                    </div>

                                    <div className="text-white p-6 rounded-xl shadow-lg border border-gray-700">
                                        {/* Title */}
                                        <h2 className="text-2xl font-bold mb-2">{t("voiceRecord.inputTitle")}</h2>
                                        <p className="text-gray-400 mb-6">
                                            {t("voiceRecord.inputDesc")}
                                        </p>

                                        {/* Recording Section */}
                                        <div className="bg-[#14171c] border border-red-900 rounded-lg p-4 flex justify-between items-center mb-5">
                                            <div className="flex items-center gap-3">
                                                <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
                                                <span className="text-red-400 font-semibold">
                                            {recording ? t("voiceRecord.recording") : t("voiceRecord.notRecording")}
                                          </span>
                                            </div>
                                            {recording && (
                                                <span className="text-red-400 font-mono text-sm">
                                        00:{String(seconds).padStart(2, "0")}
                                      </span>
                                            )}
                                        </div>

                                        {/* Success Message */}
                                        {audioSaved && (
                                            <div className="bg-green-900/50 border border-green-700 text-green-400 rounded-lg px-4 py-3 flex items-center gap-2 mb-5">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-green-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                {t("voiceRecord.recordSuccessDesc")}
                                            </div>
                                        )}

                                        {/* Buttons */}
                                        <div className="flex justify-end">
                                            {!recording ? (
                                                <button
                                                    disabled={isGenerating}
                                                    type={"button"}
                                                    onClick={startRecording}
                                                    className={`flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-all ${isGenerating && 'cursor-not-allowed opacity-50'}`}
                                                >
                                                    <Mic className="w-5 h-5" />
                                                    {t("voiceRecord.startBtn")}
                                                </button>
                                            ) : (
                                                <button
                                                    disabled={isGenerating}
                                                    type={"button"}
                                                    onClick={stopRecording}
                                                    className={`flex items-center gap-2 bg-[#49505f] hover:bg-[#5c6577] text-white px-6 py-3 rounded-lg transition-all shadow-md ${isGenerating && 'cursor-not-allowed opacity-50'}`}
                                                >
                                                    <StopCircle className="w-5 h-5 text-white" />
                                                    {t("voiceRecord.stopBtn")}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <FormItem>
                                        <FormLabel className="text-white font-bold text-[1.2rem]">
                                            {t("uploadImage")}
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative" >

                                                {isGenerating ? (
                                                    <div className="border-2 border-dashed p-20 text-center transition inset-0 bg-black/50 text-white/50 backdrop-blur-sm cursor-not-allowed flex items-center justify-center text-white font-semibold rounded-lg">
                                                        Processing...
                                                    </div>
                                                ) : <Dropzone
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
                                                }
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
                                                        disabled={isGenerating}
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
                                                            disabled={isGenerating}
                                                            placeholder={`Image ${index + 1} description...`}
                                                            {...register(`imageDescriptions.${index}`)}
                                                            className="border-input focus:border-primary focus:ring-primary/20 text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <FormField
                                        control={form.control}
                                        name="emoji"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between pb-4 px-5 pt-2  border-[0.3px] border-red-600 rounded-xl">
                                                <FormLabel className="text-white font-bold text-lg sm:text-[1.2rem] mt-1">
                                                    {t("includeEmojis")}
                                                </FormLabel>
                                                <FormControl>
                                                    <label className={`relative inline-flex items-center ${!isGenerating ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed' }`}>
                                                        <input
                                                            disabled={isGenerating}
                                                            type="checkbox"
                                                            checked={field.value}
                                                            onChange={(e) => field.onChange(e.target.checked)}
                                                            className="sr-only peer "
                                                        />
                                                        <div
                                                            className={`w-11 h-6 rounded-full transition-colors duration-300 
                                                                            ${field.value ? "bg-green-500" : "bg-gray-400"}`}
                                                        >
                                                            <div
                                                                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300
                                                                               ${field.value ? "translate-x-5" : "translate-x-0"}`}
                                                            >
                                                            </div>
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
                            {/*<div>*/}
                            {/*    <label htmlFor="title" className="text-white text-[1.2rem]">{t("titleOfContent")}</label>*/}
                            {/*    <Input*/}
                            {/*        id="title"*/}
                            {/*        value={title}*/}
                            {/*        onChange={onTitleHandler}*/}
                            {/*        placeholder={t("titlePlaceholder")}*/}
                            {/*        className="bg-white border-black/20 mt-2  placeholder:text-white/50 focus:border-primary"*/}
                            {/*    />*/}
                            {/*</div>*/}
                            <Button
                                type="button"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-mot-red font-medium border-white"
                                size="lg"
                                onClick={() => {
                                    setPageName(form.getValues().title);
                                    setIsModalOpen(true);
                                }}
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
                            <Button
                                onClick={handleCopy}
                                variant="outline"
                                className="px-4 py-2 sm:px-6 sm:py-2.5 border-none text-white bg-primary hover:bg-primary/90 rounded-xl transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base"
                            >
                                <Copy className="h-4 w-4" />
                                <span>{copied ? t("viewModal.button_copied") : t("viewModal.button_copy")}</span>
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
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-gray-900 text-white border border-red-700">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">{t("pageName")}</DialogTitle>
                    </DialogHeader>

                    <div className="mt-4">
                        <Input
                            value={pageName}
                            onChange={(e) => setPageName(e.target.value)}
                            placeholder={t("pageNamePlaceholder")}
                            className="bg-white text-black"
                        />
                    </div>

                    <DialogFooter className="mt-6 flex justify-end gap-3">
                        <DialogClose asChild>
                            <Button
                                disabled={isSaving}
                                variant="outline"
                                className={`bg-gray-700 text-white hover:bg-gray-600 ${isSaving && 'cursor-not-allowed'}`}
                                onClick={() => setIsModalOpen(false)}
                            >
                                {t("cancel")}
                            </Button>
                        </DialogClose>
                        <Button
                            className="bg-primary hover:bg-primary/90 text-white"
                            disabled={isSaving || !pageName.trim()}
                            onClick={onSaveContent}
                        >
                            {isSaving ? t("saving") : t("saveContent")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

    );
}
