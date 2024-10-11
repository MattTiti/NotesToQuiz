import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const GenerationHeader = ({
  quizType,
  setQuizType,
  numQuestions,
  setNumQuestions,
  disabled,
}) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between gap-4">
        <CardTitle>Generate a Quiz</CardTitle>
        <div className="flex w-1/4 gap-2">
          <Select
            value={quizType}
            onChange={(e) => setQuizType(e.target.value)}
          >
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
          <Select
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
          >
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
    </CardHeader>
  );
};

export default GenerationHeader;
