import {contentReferenceList} from "@/utils/referenceList";

export function clean(input?: string): string {
    return input?.trim() || "";
}

export function addSection(label: string, value?: string): string {
    return value && value.trim().length > 0 ? `${label}: ${value}\n` : "";
}

export function wordContent(value: string): string {
    if(value === "short") {
        return "350";
    }else if(value === "medium") {
        return "500";
    }else {
        return "650";
    }
}

export function formatDescriptions(imageDescriptions?: string[]): string {
    if (!imageDescriptions || imageDescriptions.length === 0) {
        return "";
    }
    const formatted = imageDescriptions
        .map((desc, index) => `Description of Image ${index + 1}: ${desc?.trim() || ""}`)
        .join("\n");

    return formatted;
}

export function contentReference(purpose?: string): string {
    let ref = "";
    contentReferenceList.filter(content => {
         if(purpose?.includes(content.purpose)) {
             ref = content.content;
         }
    })
    return ref;
}