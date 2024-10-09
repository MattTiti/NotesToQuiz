import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(req) {
  const { bankStatement } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a specialized assistant tasked with accurately parsing bank statements. Your goal is to extract expense details such as the exact name and cost directly from the statement text, without making up or altering any information. Categories should be inferred from the content based on predefined categories.",
        },
        {
          role: "user",
          content: `Please extract the expenses from the following bank statement. For each expense:
- **Name**: Take the name exactly as it appears in the statement.
- **Cost**: Take the cost as a numeric value directly from the statement.
- **Category**: Infer the category from the context using these categories: groceries, dining, entertainment, transportation, housing, subscriptions, health, vacation, and other.

**Do not generate or infer names or costs that are not explicitly mentioned in the bank statement.** Return the data as a valid JSON string array in this format:
\`[{"name": "Exact name from statement", "cost": "Cost from statement", "category": "Inferred category"}]\`

Here is the bank statement:
${bankStatement}`,
        },
      ],
    });

    // Log the response content before parsing
    let content = completion.choices[0].message.content;

    // Use a regex to extract the content inside the square brackets
    const jsonArrayMatch = content.match(/\[.*\]/s);
    if (jsonArrayMatch) {
      content = jsonArrayMatch[0]; // Get the first match which should be the JSON array
    } else {
      throw new Error("No JSON array found in the response.");
    }

    // Attempt to parse the sanitized content as JSON
    const parsedExpenses = JSON.parse(content);

    return NextResponse.json({ expenses: parsedExpenses });
  } catch (error) {
    console.error("Error parsing bank statement:", error);
    return NextResponse.json(
      { error: "Error parsing bank statement" },
      { status: 500 }
    );
  }
}
