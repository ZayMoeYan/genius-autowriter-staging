

export async function testApiKey(apiKey: string) {
    try {
        const res = await fetch('/api/test-gemini-key', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiKey }),
        });

        const data = await res.json();

        return !!data.valid;
    } catch (err) {
        throw err;
    }
}