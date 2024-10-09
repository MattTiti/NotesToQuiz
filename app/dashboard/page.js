"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignIn from "@/components/SignIn";
import ButtonCheckout from "@/components/ButtonCheckout";
import config from "@/config";

// Assume these functions fetch data from an API
async function fetchSavedQuizzes(userId) {
  // This is a placeholder. Replace with actual API call.
  return [
    { id: 1, title: "History Quiz", createdAt: "2023-06-01" },
    { id: 2, title: "Science Quiz", createdAt: "2023-06-02" },
    { id: 3, title: "Math Quiz", createdAt: "2023-06-03" },
  ];
}

async function checkUserPurchase(userId) {
  // This is a placeholder. Replace with actual API call.
  return false; // Assume the user hasn't made a purchase
}

export default function QuizGenerator() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const { data: session, status } = useSession();
  const [showSignIn, setShowSignIn] = useState(false);
  const [savedQuizzes, setSavedQuizzes] = useState([]);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      setShowSignIn(true);
    } else {
      setShowSignIn(false);
    }
  }, [status]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchSavedQuizzes(session.user.id).then(setSavedQuizzes);
      checkUserPurchase(session.user.id).then(setHasPurchased);
    }
  }, [session]);

  const handleTextSubmit = () => {
    // TODO: Implement quiz generation from text
    console.log("Generating quiz from text:", text);
  };

  const handleFileSubmit = () => {
    // TODO: Implement quiz generation from file
    console.log("Generating quiz from file:", file);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SignIn isOpen={showSignIn} />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Quiz Generator</h1>
          {session && (
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          )}
        </div>

        <Tabs defaultValue="text" className="mb-8">
          <TabsList>
            <TabsTrigger value="text">Input Text</TabsTrigger>
            <TabsTrigger value="file">Upload File</TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <Card>
              <CardHeader>
                <CardTitle>Generate Quiz from Text</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="mb-4"
                />
                <Button onClick={handleTextSubmit}>Generate Quiz</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="file">
            <Card>
              <CardHeader>
                <CardTitle>Generate Quiz from File</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="mb-4"
                />
                <Button onClick={handleFileSubmit}>Generate Quiz</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {session && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Saved Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                {savedQuizzes.length > 0 ? (
                  <ul className="space-y-2">
                    {savedQuizzes.map((quiz) => (
                      <li
                        key={quiz.id}
                        className="flex justify-between items-center p-2 bg-secondary rounded-md"
                      >
                        <span>{quiz.title}</span>
                        <span className="text-sm text-muted-foreground">
                          {quiz.createdAt}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No saved quizzes yet.</p>
                )}
              </CardContent>
            </Card>

            {!hasPurchased && (
              <Card>
                <CardHeader>
                  <CardTitle>Upgrade to Pro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ul className="list-disc list-inside space-y-2">
                      <li>Unlimited quiz generation</li>
                      <li>Save and edit your quizzes</li>
                      <li>Advanced question types</li>
                      <li>Priority support</li>
                    </ul>
                    <ButtonCheckout priceId={config.stripe.priceId} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </>
  );
}
