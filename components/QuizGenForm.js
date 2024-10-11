import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GenerationHeader from "@/components/GenerationHeader";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { WandSparkles, Upload, File, FileText } from "lucide-react";
import Spinner from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";

const MAX_CHARACTERS = 10000;

export default function QuizGenForm({
  quizType,
  setQuizType,
  numQuestions,
  setNumQuestions,
  disabled,
  text,
  setText,
  file,
  setFile,
  generatedQuiz,
  handleTextSubmit,
  handleFileSubmit,
  setIsQuizDialogOpen,
  loading,
  setGeneratedQuiz,
  tokens,
  hasFreeGeneration,
}) {
  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= MAX_CHARACTERS) {
      setText(newText);
    }
  };

  return (
    <Tabs defaultValue="file" className="mb-8">
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="file">Upload File</TabsTrigger>
          <TabsTrigger value="text">Input Text</TabsTrigger>
        </TabsList>
        <Badge className="bg-rose-600 hover:bg-rose-600">
          NO ADS. NO PAYMENT REQUIRED.
        </Badge>
      </div>
      <TabsContent value="text">
        <Card>
          <GenerationHeader
            quizType={quizType}
            setQuizType={setQuizType}
            numQuestions={numQuestions}
            setNumQuestions={setNumQuestions}
            disabled={disabled}
            tokens={tokens}
            hasFreeGeneration={hasFreeGeneration}
          />
          <CardContent>
            {loading ? (
              <Spinner />
            ) : (
              <>
                <Textarea
                  placeholder="Enter your text here..."
                  value={text}
                  onChange={handleTextChange}
                  className="mb-1 min-h-[200px]"
                  maxLength={MAX_CHARACTERS}
                />
                <div className="text-sm text-gray-500 text-right">
                  {text.length}/{MAX_CHARACTERS} characters
                </div>
              </>
            )}
            <div className="flex justify-between items-center mt-4 ">
              {generatedQuiz && (
                <Button
                  onClick={() => setIsQuizDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-600/90"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Last Quiz
                </Button>
              )}
              <div className="flex justify-end w-full gap-2 items-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setText("");
                    setGeneratedQuiz(null);
                  }}
                >
                  Clear
                </Button>
                <Button
                  onClick={handleTextSubmit}
                  className="bg-blue-600 hover:bg-blue-600/90"
                  disabled={!text || loading}
                >
                  <WandSparkles className="w-4 h-4 mr-2" />
                  Generate Quiz
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="file">
        <Card>
          <GenerationHeader
            quizType={quizType}
            setQuizType={setQuizType}
            numQuestions={numQuestions}
            setNumQuestions={setNumQuestions}
            disabled={disabled}
            tokens={tokens}
            hasFreeGeneration={hasFreeGeneration}
          />
          <CardContent>
            <div className="flex items-center justify-center w-full">
              {loading ? (
                <Spinner />
              ) : (
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {file ? (
                      <>
                        <File className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          Selected file:{" "}
                          <span className="font-semibold">{file.name}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Click to change file
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PDF, DOCX, or TXT (MAX. 10MB)
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                    accept=".pdf,.docx,.txt"
                  />
                </label>
              )}
            </div>
            <div className="flex justify-between items-center mt-4">
              {generatedQuiz && (
                <Button
                  onClick={() => setIsQuizDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-600/90"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Last Quiz
                </Button>
              )}
              <div className="flex justify-end mt-4 w-full gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null);
                    setGeneratedQuiz(null);
                  }}
                >
                  Clear
                </Button>
                <Button
                  onClick={handleFileSubmit}
                  className="bg-indigo-600 hover:bg-indigo-600/90"
                  disabled={!file || loading}
                >
                  <WandSparkles className="w-4 h-4 mr-2" />
                  Generate Quiz
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
