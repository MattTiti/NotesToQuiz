import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
export default function QuizDialog({
  quiz,
  isOpen,
  onClose,
  onSave,
  hasPurchased,
}) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedAnswers({});
      setShowCorrectAnswers(false);
    }
  }, [isOpen]);

  const handleAnswerChange = (questionIndex, answer) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleCheckAnswers = () => {
    setShowCorrectAnswers(true);
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setShowCorrectAnswers(false);
  };

  if (!quiz) return null;

  const isSavedQuiz = Boolean(quiz._id);
  const questions = isSavedQuiz ? quiz.questions : quiz;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isSavedQuiz ? quiz.title : "Generated Quiz"}
          </DialogTitle>
        </DialogHeader>
        {questions.map((question, index) => (
          <div key={index} className="mb-6">
            <h3 className="font-semibold mb-2">
              {index + 1}. {question.question}
            </h3>
            <RadioGroup
              onValueChange={(value) => handleAnswerChange(index, value)}
              value={selectedAnswers[index]}
            >
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option}
                    id={`q${index}-option${optionIndex}`}
                  />
                  <Label htmlFor={`q${index}-option${optionIndex}`}>
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {question.type === "sa" && <Textarea />}
            {showCorrectAnswers && question.type !== "sa" && (
              <p
                className={`mt-2 ${
                  selectedAnswers[index] === question.answer
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Correct answer: {question.answer}
              </p>
            )}
            {showCorrectAnswers && question.type === "sa" && (
              <p className="text-black/50">Correct answer: {question.answer}</p>
            )}
          </div>
        ))}
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button
              onClick={handleCheckAnswers}
              className="bg-emerald-600 hover:bg-emerald-600/90"
            >
              Check Answers
            </Button>
            <div className="flex gap-2">
              <Button onClick={handleRestart} variant="outline">
                Restart
              </Button>
              {!isSavedQuiz && hasPurchased && (
                <Button onClick={onSave} variant="outline">
                  Save
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
