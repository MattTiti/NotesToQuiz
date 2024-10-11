"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import SignIn from "@/components/SignIn";
import config from "@/config";
import ButtonAccount from "@/components/ButtonAccount";
import Image from "next/image";
import Feedback from "@/components/Feedback";
import toast from "react-hot-toast";
import QuizDialog from "@/components/QuizDialog";
import SaveQuizDialog from "@/components/SaveQuizDialog";
import QuizGenForm from "@/components/QuizGenForm";
import SavedQuizzes from "@/components/SavedQuizzes";
import UpgradeCard from "@/components/UpgradeCard";
import Footer from "@/components/Footer";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
const MAX_CHARACTERS = 10000;

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
  const [tokens, setTokens] = useState(null);
  const [hasFreeGeneration, setHasFreeGeneration] = useState(true);

  useEffect(() => {
    async function fetchTokens() {
      const response = await fetch("/api/tokens");
      const data = await response.json();
      setTokens(data.tokens);
    }
    fetchTokens();
  }, [generatedQuiz]);

  useEffect(() => {
    if (hasFreeGeneration) {
      setDisabled(true);
      setHasPurchased(false);
    }

    if (status === "unauthenticated" && !hasFreeGeneration) {
      setShowSignIn(true);
    } else {
      setShowSignIn(false);
    }
  }, [status]);

  useEffect(() => {
    if (session?.user?.id) {
      setHasFreeGeneration(false);
      fetchSavedQuizzes();
      checkUserPurchase();
    } else {
      const usedFreeGeneration = localStorage.getItem("usedFreeGeneration");
      setHasFreeGeneration(usedFreeGeneration !== "true");
    }
  }, [session]);

  async function extractTextFromFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(`Failed to extract text: ${errorData.message}`);
      }

      const result = await response.json();
      return result.text;
    } catch (error) {
      console.error("Error in extractTextFromFile:", error);
      throw error;
    }
  }

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
    setDisabled(!data.userHasAccess);
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
        let text = await extractTextFromFile(file);

        if (!hasPurchased && text.length > MAX_CHARACTERS) {
          text = text.slice(0, MAX_CHARACTERS);
          toast.custom(
            <div className="flex items-center bg-white text-neutral-700 p-4 rounded-md shadow-lg">
              <Info className="w-5 h-5 mr-2 text-blue-500" />
              Only using first 10,000 characters.
            </div>
          );
        }

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
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}`;

    if (!session && !hasFreeGeneration) {
      toast.error(
        "You have used your free generation. Please sign up to continue."
      );
      setLoading(false);
      return;
    }

    if (session && tokens < 1 && !hasPurchased) {
      toast.error(
        `No tokens left for ${formattedDate}. Please upgrade to continue.`
      );
      setLoading(false);
      return;
    }

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
      if (session) {
        await fetch("/api/tokens", { method: "POST" });
      } else {
        localStorage.setItem("usedFreeGeneration", "true");
        setHasFreeGeneration(false);
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
          {session ? (
            <ButtonAccount />
          ) : (
            <Button variant="outline" onClick={() => setShowSignIn(true)}>
              Sign In
            </Button>
          )}
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
          tokens={tokens}
          hasFreeGeneration={hasFreeGeneration}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SavedQuizzes
            savedQuizzes={savedQuizzes}
            handleQuizClick={handleQuizClick}
            hasPurchased={hasPurchased}
          />

          {!hasPurchased ? <UpgradeCard plan={plan} /> : <Feedback />}
        </div>
      </div>
      <QuizDialog
        quiz={selectedQuiz || generatedQuiz}
        isOpen={isQuizDialogOpen}
        onClose={() => {
          setIsQuizDialogOpen(false);
          setSelectedQuiz(null);
        }}
        onSave={handleInitiateSaveQuiz}
        hasPurchased={hasPurchased}
      />
      <SaveQuizDialog
        title={title}
        setTitle={setTitle}
        isOpen={isSaveQuizDialogOpen}
        onClose={() => setIsSaveQuizDialogOpen(false)}
        onSave={handleSaveQuiz}
      />
      <Footer />
    </>
  );
}
