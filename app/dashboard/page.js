"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import SignIn from "@/components/SignIn";
import config from "@/config";
import ButtonAccount from "@/components/ButtonAccount";
import Image from "next/image";
import { extractTextFromFile } from "@/libs/fileExtractor";
import Feedback from "@/components/Feedback";
import toast from "react-hot-toast";
import QuizDialog from "@/components/QuizDialog";
import SaveQuizDialog from "@/components/SaveQuizDialog";
import QuizGenForm from "@/components/QuizGenForm";
import SavedQuizzes from "@/components/SavedQuizzes";
import UpgradeCard from "@/components/UpgradeCard";

export default function QuizGenerator() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const { data: session, status } = useSession();
  const [showSignIn, setShowSignIn] = useState(false);
  const [savedQuizzes, setSavedQuizzes] = useState([]);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [quizType, setQuizType] = useState("mc");
  const [numQuestions, setNumQuestions] = useState("5");
  const [disabled, setDisabled] = useState(false);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [isSaveQuizDialogOpen, setIsSaveQuizDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const plan = config.stripe.plans[0];

  useEffect(() => {
    if (status === "unauthenticated") {
      setShowSignIn(true);
    } else {
      setShowSignIn(false);
    }
  }, [status]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchSavedQuizzes();
      checkUserPurchase();
    }
  }, [session]);

  const fetchSavedQuizzes = async () => {
    try {
      const response = await fetch("/api/quizzes");
      if (!response.ok) {
        throw new Error("Failed to fetch quizzes");
      }
      const quizzes = await response.json();
      setSavedQuizzes(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      toast.error("Failed to fetch quizzes");
    }
  };

  const checkUserPurchase = async () => {
    const response = await fetch("/api/access");
    const data = await response.json();
    setDisabled(data.userHasAccess);
    setHasPurchased(data.userHasAccess);
  };

  const handleTextSubmit = async () => {
    if (text) {
      try {
        setLoading(true);
        await generateQuiz({ text, type: quizType, numQuestions });
      } catch (error) {
        console.error("Error generating quiz from text:", error);
        setLoading(false);
        toast.error("Error generating quiz from text");
      }
    } else {
      toast.error("Please enter some text");
    }
  };

  const handleFileSubmit = async () => {
    if (file) {
      try {
        setLoading(true);
        const text = await extractTextFromFile(file);
        await generateQuiz({ text, type: quizType, numQuestions });
      } catch (error) {
        console.error("Error extracting text from file:", error);
        setLoading(false);
        toast.error("Error extracting text from file");
      }
    } else {
      toast.error("No file selected");
    }
  };

  const generateQuiz = async ({ text, type, numQuestions }) => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, type, numQuestions }),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedQuiz(data.quiz);
      setIsQuizDialogOpen(true);
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Error generating quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateSaveQuiz = () => {
    setIsQuizDialogOpen(false);
    setIsSaveQuizDialogOpen(true);
  };

  const handleSaveQuiz = async () => {
    setIsSaveQuizDialogOpen(false);
    try {
      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, questions: generatedQuiz }),
      });
      if (!response.ok) {
        throw new Error("Failed to save quiz");
      }
      toast.success("Quiz saved successfully");
      fetchSavedQuizzes();
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast.error("Failed to save quiz");
    }
  };

  const handleQuizClick = (quiz) => {
    setSelectedQuiz(quiz);
    setIsQuizDialogOpen(true);
  };

  return (
    <>
      <SignIn isOpen={showSignIn} />
      <div className="mx-auto min-h-screen bg-white px-8 py-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center justify-center">
            <Image
              src="/stretch-icon.png"
              alt={`${config.appName} logo`}
              className="w-10 h-10 fill-primary-content group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200 mr-2"
              priority={true}
              width={100}
              height={100}
            />
            <h1 className="text-2xl font-bold">NotesToQuiz</h1>
          </div>
          {session && <ButtonAccount />}
        </div>
        <QuizGenForm
          quizType={quizType}
          setQuizType={setQuizType}
          numQuestions={numQuestions}
          setNumQuestions={setNumQuestions}
          disabled={disabled}
          text={text}
          setText={setText}
          file={file}
          setFile={setFile}
          generatedQuiz={generatedQuiz}
          handleTextSubmit={handleTextSubmit}
          handleFileSubmit={handleFileSubmit}
          setIsQuizDialogOpen={setIsQuizDialogOpen}
          loading={loading}
          setGeneratedQuiz={setGeneratedQuiz}
        />
        {session && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SavedQuizzes
              savedQuizzes={savedQuizzes}
              handleQuizClick={handleQuizClick}
            />

            {!hasPurchased ? <UpgradeCard plan={plan} /> : <Feedback />}
          </div>
        )}
      </div>
      <QuizDialog
        quiz={selectedQuiz || generatedQuiz}
        isOpen={isQuizDialogOpen}
        onClose={() => {
          setIsQuizDialogOpen(false);
          setSelectedQuiz(null);
        }}
        onSave={handleInitiateSaveQuiz}
      />
      <SaveQuizDialog
        title={title}
        setTitle={setTitle}
        isOpen={isSaveQuizDialogOpen}
        onClose={() => setIsSaveQuizDialogOpen(false)}
        onSave={handleSaveQuiz}
      />
    </>
  );
}
