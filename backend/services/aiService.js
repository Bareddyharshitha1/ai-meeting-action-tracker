const ollama = require("ollama").default;

async function extractActionItems(transcript) {
    const response = await ollama.chat({
        model: "llama3.2:3b",
        messages: [
            {
                role: "system",
                content: `
You are an AI meeting assistant.

Analyze the meeting transcript and extract action items.

Return ONLY one JSON object.

The JSON format must be exactly:

{
  "actionItems": [
    {
      "task": "string",
      "assignedTo": "string",
      "deadline": "YYYY-MM-DD or null",
      "priority": "Low, Medium, or High",
      "status": "Pending"
    }
  ]
}

Rules:
- Do not write explanations.
- Do not use markdown.
- Do not put JSON inside code fences.
- priority must be Low, Medium, or High.
- status must always be Pending.
- Convert relative dates like "tomorrow" into YYYY-MM-DD.
- If no deadline is mentioned, use null.
- If the responsible person is unclear, use "Unassigned".
- Today's date is: 2026-10-07.
`
            },
            {
                role: "user",
                content: transcript
            }
        ]
    });

    let result = response.message.content.trim();

    result = result
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    const start = result.indexOf("{");
    const end = result.lastIndexOf("}");

    if (start === -1 || end === -1) {
        throw new Error("AI did not return valid JSON");
    }

    result = result.substring(start, end + 1);

    return JSON.parse(result);
}


// Generate meeting summary
async function generateMeetingSummary(transcript) {
    const response = await ollama.chat({
        model: "llama3.2:3b",
        messages: [
            {
                role: "system",
                content: `
You are an AI meeting assistant.

Summarize the meeting transcript.

Return ONLY one JSON object in exactly this format:

{
  "summary": "short meeting summary",
  "keyPoints": [
    "important point 1",
    "important point 2",
    "important point 3"
  ]
}

Rules:
- Keep the summary concise.
- Extract the most important discussion points.
- Do not invent information.
- Do not write explanations.
- Do not use markdown.
- Do not put JSON inside code fences.
`
            },
            {
                role: "user",
                content: transcript
            }
        ]
    });

    let result = response.message.content.trim();

    result = result
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    const start = result.indexOf("{");
    const end = result.lastIndexOf("}");

    if (start === -1 || end === -1) {
        throw new Error("AI did not return valid summary JSON");
    }

    result = result.substring(start, end + 1);

    return JSON.parse(result);
}


module.exports = {
    extractActionItems,
    generateMeetingSummary
};