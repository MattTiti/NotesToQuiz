import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Infinity } from "lucide-react";

const GenerationHeader = ({
  quizType,
  setQuizType,
  numQuestions,
  setNumQuestions,
  disabled,
  tokens,
  hasFreeGeneration,
}) => {
  return (
    <CardHeader className="pb-1 space-y-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <CardTitle>Generate a Quiz</CardTitle>

        <div className="flex sm:w-1/4 gap-2">
          <Select value={quizType} onValueChange={setQuizType}>
            <SelectTrigger>
              <SelectValue placeholder="Select quiz type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mc">Multiple Choice</SelectItem>
              <SelectItem value="tf">True/False</SelectItem>
              <SelectItem value="sa" disabled={disabled}>
                Short Answer
              </SelectItem>
              <SelectItem value="mixed" disabled={disabled}>
                Mixed
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={numQuestions} onValueChange={setNumQuestions}>
            <SelectTrigger>
              <SelectValue placeholder="Select # of questions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 questions</SelectItem>
              <SelectItem value="10">10 questions</SelectItem>
              <SelectItem value="15" disabled={disabled}>
                15 questions
              </SelectItem>
              <SelectItem value="20" disabled={disabled}>
                20 questions
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <span className="text-xs sm:text-sm text-muted-foreground ml-1">
        {hasFreeGeneration ? (
          "Free generation available"
        ) : (
          <>
            {!disabled && (
              <span className="flex items-center">
                <Infinity className="w-4 h-4 mr-1" /> Unlimited tokens &
                characters
              </span>
            )}
            {disabled &&
              tokens > 0 &&
              `${tokens} token${
                tokens !== 1 ? "s" : ""
              } remaining (10,000 character limit)`}
            {disabled &&
              tokens === 0 &&
              "0 tokens remaining (10,000 character limit)"}
            {!hasFreeGeneration && !tokens && tokens !== 0 && (
              <span className="flex items-center">
                Sign Up to generate more quizzes
              </span>
            )}
          </>
        )}
      </span>
    </CardHeader>
  );
};

export default GenerationHeader;
