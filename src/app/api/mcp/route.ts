import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
    const origin = req.nextUrl.origin;

    const manifest = {
        type: "mcp-manifest",
        name: "Genius Autowriter MCP",
        version: "1.0.0",
        description: "MCP server for Genius Autowriter authentication and content generation system.",
        tools: [
            {
                name: "loginUser",
                description: "Authenticate user with email, password, and Gemini API key to obtain JWT token.",
                endpoint: `${origin}/api/mcp/tools/login`,
                input_schema: {
                    type: "object",
                    required: ["email", "password", "geminiApiKey"],
                    properties: {
                        email: { type: "string", description: "User email for Genius Autowriter account" },
                        password: { type: "string", description: "Account password" },
                        geminiApiKey: { type: "string", description: "Gemini API key to link AI generation" },
                    },
                },
            },
            {
                name: "generateContent",
                description: "Generate AI-written content using structured inputs.",
                endpoint: `${origin}/api/mcp/tools/generate`,
                input_schema: {
                    type: "object",
                    required: [
                        "title",
                        "topic",
                        "purpose",
                        "audience",
                        "writingStyle",
                        "outputLanguage",
                        "contentLength",
                        "apikey"
                    ],
                    properties: {
                        title: { type: "string", description: "Title of the content" },
                        topic: { type: "string", description: "Main topic or subject" },
                        purpose: { type: "string", description: "Purpose of the writing" },
                        audience: { type: "string", description: "Target audience" },
                        writingStyle: { type: "string", description: "Tone or writing style" },
                        outputLanguage: { type: "string", description: "Output language" },
                        contentLength: { type: "string", description: "Desired length of content" },
                        imageDescriptions: { type: "array", description: "Descriptions for related images", items: { type: "string" } },
                        negativeConstraints: { type: "string", description: "Things to avoid mentioning" },
                        hashtags: { type: "string", description: "Hashtags to include" },
                        emoji: { type: "boolean", description: "Whether to include emoji" },
                        apikey: { type: "string", description: "User’s API key or session token" },
                    },
                },
            },
        ],
    };

    return NextResponse.json(manifest, {
        headers: { "Access-Control-Allow-Origin": "*" },
    });
}
