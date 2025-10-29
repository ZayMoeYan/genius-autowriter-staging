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
        return "450";
    }else {
        return "550";
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

const cache = new Map<string, string>();

export function contentReference(purpose?: string): string {
    if (!purpose) return "";
    if (cache.has(purpose)) return cache.get(purpose)!;

    const match = contentReferenceList.find(content =>
        purpose.includes(content.purpose)
    );
    const result = match ? match.content : "";
    cache.set(purpose, result);
    return result;
}