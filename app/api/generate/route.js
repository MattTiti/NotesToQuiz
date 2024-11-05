import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(req) {
  // Get the text (notes) from the request body
  const { text, type, numQuestions } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  let questionType = "";

  if (type === "mc") {
    questionType = "multiple choice only ";
  } else if (type === "sa") {
    questionType = "short answer only ";
  } else if (type === "tf") {
    questionType = "true/false only ";
  } else {
    questionType = "multiple choice only ";
  }

  try {
    // Send request to OpenAI to generate quiz questions from the provided text
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            'You are a specialized assistant tasked with creating quiz questions from text. The quiz questions can be of 3 types: multiple choice (mc), short answer (sa), or true/false (tf). If it\'s a multiple choice question, provide options and make sure the answer is one of the options. Return the quiz as a valid JSON array with the following format: [{"question": "", "answer": "", "type": "mc or sa", "options": []}]. If it\'s a short answer question, leave the options array empty. If it\'s a true/false question, provide two options. If it\'s a fill in the blank question, provide one option.',
        },
        {
          role: "user",
          content: `Generate a ${numQuestions} question ${questionType}quiz from the following text: \n${text}`,
        },
      ],
    });

    // Extract the response content from OpenAI
    let content = completion.choices[0].message.content;

    // Use a regex to extract the JSON array from the response
    const jsonArrayMatch = content.match(/\[.*\]/s);
    if (jsonArrayMatch) {
      content = jsonArrayMatch[0]; // Get the first match, which should be the JSON array
    } else {
      throw new Error("No JSON array found in the response.");
    }

    // Parse the JSON array of quiz questions
    const parsedQuiz = JSON.parse(content);

    // Return the quiz questions as JSON
    return NextResponse.json({ quiz: parsedQuiz });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      { error: "Error generating quiz" },
      { status: 500 }
    );
  }
}
