import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      answer: { type: String, required: true },
      type: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
