import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import Quiz from "@/models/Quiz";
import connectMongo from "@/libs/mongoose";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();

  const { title, questions } = await req.json();

  try {
    const quiz = new Quiz({
      userId: session.user.id,
      title,
      questions,
    });

    await quiz.save();

    return NextResponse.json(
      { message: "Quiz saved successfully", quiz },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving quiz:", error);
    return NextResponse.json({ error: "Error saving quiz" }, { status: 500 });
  }
}

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();

  try {
    const quizzes = await Quiz.find({ userId: session.user.id }).sort({
      createdAt: -1,
    });
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Error fetching quizzes" },
      { status: 500 }
    );
  }
}
