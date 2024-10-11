"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Feedback({
  handleSubmit,
  feedbackMessage,
  setFeedbackMessage,
  isSubmitting,
}) {
  return (
    <Card className="text-black">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Leave Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              id="feedback"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 min-h-[200px]"
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              placeholder="We'd love to hear from you! What do you like, what do you dislike, what do you want to see? We're all ears."
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="outline" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
