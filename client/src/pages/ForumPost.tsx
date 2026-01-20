import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { toast } from "sonner";
import { useRoute } from "wouter";

export default function ForumPost() {
  const { user } = useAuth();
  const [, params] = useRoute("/forum/post/:id");
  const postId = params?.id ? parseInt(params.id) : null;
  const [answerContent, setAnswerContent] = useState("");

  const { data: postData, isLoading: postLoading, refetch } = trpc.forum.getPost.useQuery(
    { id: postId || 0 },
    { enabled: !!postId }
  );

  const createAnswerMutation = trpc.forum.createAnswer.useMutation();
  const voteAnswerMutation = trpc.forum.voteAnswer.useMutation();
  const markBestAnswerMutation = trpc.forum.markBestAnswer.useMutation();

  if (!postId || postLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Post Not Found</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!answerContent.trim()) {
      toast.error("Please enter your answer");
      return;
    }

    try {
      await createAnswerMutation.mutateAsync({
        postId: postId,
        content: answerContent,
      });

      toast.success("Answer posted successfully!");
      setAnswerContent("");
      refetch();
    } catch (error) {
      toast.error("Failed to post answer");
      console.error(error);
    }
  };

  const handleVote = async (answerId: number, voteType: "upvote" | "downvote") => {
    try {
      await voteAnswerMutation.mutateAsync({
        answerId,
        voteType,
      });

      toast.success("Vote recorded!");
      refetch();
    } catch (error) {
      toast.error("Failed to vote");
      console.error(error);
    }
  };

  const handleMarkBest = async (answerId: number) => {
    try {
      await markBestAnswerMutation.mutateAsync({
        answerId,
        postId,
      });

      toast.success("Marked as best answer!");
      refetch();
    } catch (error) {
      toast.error("Failed to mark as best answer");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Question */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{postData.title}</CardTitle>
            <CardDescription>
              Asked by {postData.authorId} on {new Date(postData.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-base whitespace-pre-wrap">{postData.content}</p>
            {postData.category && (
              <div className="mt-4">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {postData.category}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Answers */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {postData.answers?.length || 0} Answer{(postData.answers?.length || 0) !== 1 ? "s" : ""}
          </h2>

          <div className="space-y-4">
            {postData.answers && postData.answers.length > 0 ? (
              postData.answers.map((answer: any) => (
                <Card key={answer.id} className={answer.isBestAnswer ? "ring-2 ring-green-500" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Answer</CardTitle>
                        <CardDescription>
                          By {answer.authorId} on {new Date(answer.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      {answer.isBestAnswer && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Best Answer
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base whitespace-pre-wrap mb-4">{answer.content}</p>

                    <div className="flex gap-2 items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVote(answer.id, "upvote")}
                        className="gap-1"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        {answer.votes || 0}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVote(answer.id, "downvote")}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </Button>

                      {user && user.id === postData.authorId && !answer.isBestAnswer && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkBest(answer.id)}
                          className="ml-auto gap-1"
                        >
                          <Check className="w-4 h-4" />
                          Mark as Best
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No answers yet. Be the first to answer!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Answer Form */}
        {user ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <Textarea
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  placeholder="Write your answer here..."
                  rows={6}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={createAnswerMutation.isPending}>
                    {createAnswerMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post Answer"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Please log in to post an answer</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
