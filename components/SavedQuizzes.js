import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Lock } from "lucide-react"; // Import the Lock icon from lucide-react

export default function SavedQuizzes({
  savedQuizzes,
  handleQuizClick,
  hasPurchased,
}) {
  const [search, setSearch] = useState("");

  const filteredQuizzes = useMemo(() => {
    if (!search.trim()) return savedQuizzes;

    return savedQuizzes.filter((quiz) => {
      const lowerSearch = search.toLowerCase();

      // Check if the title matches
      if (quiz.title.toLowerCase().includes(lowerSearch)) return true;

      // Check if any question matches
      return quiz.questions.some(
        (question) =>
          question.question.toLowerCase().includes(lowerSearch) ||
          question.options.some((option) =>
            option.toLowerCase().includes(lowerSearch)
          ) ||
          question.answer.toLowerCase().includes(lowerSearch)
      );
    });
  }, [savedQuizzes, search]);

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="shadow-sm">
        <div className="flex justify-between items-center">
          <CardTitle>Saved Quizzes</CardTitle>
          <Input
            placeholder="Search by title, question, option or answer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </CardHeader>
      <CardContent className="max-h-[300px] overflow-y-auto mt-2">
        {hasPurchased ? (
          filteredQuizzes.length > 0 ? (
            <ul className="space-y-2">
              {filteredQuizzes.map((quiz) => (
                <li
                  key={quiz?._id}
                  className="flex justify-between items-center p-2 bg-secondary rounded-md cursor-pointer hover:bg-secondary/80"
                  onClick={() => handleQuizClick(quiz)}
                >
                  <span>{quiz?.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(quiz?.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center py-16">
              {savedQuizzes.length > 0
                ? "No matching quizzes found"
                : "No saved quizzes yet"}
            </p>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-16">
            <Lock className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-center text-gray-600">Upgrade to save quizzes</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
