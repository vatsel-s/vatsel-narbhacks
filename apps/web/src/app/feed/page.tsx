"use client";

import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

export default function FeedPage() {
  const { user } = useUser();
  const userId = user?.id;
  const { clerk } = useClerk();

  // Get all friends (accepted only)
  const friends = useQuery(api.friends.getFriends, userId ? { userId, status: "accepted" } : "skip");
  // Get all comments (for MVP, fetch all and filter in frontend)
  const allComments = useQuery(api.comments.getAll); // You may need to implement this query if not present

  // Gather all friend userIds
  const friendIds = friends
    ? Array.from(new Set(friends.map((f: any) => (f.userId === userId ? f.friendId : f.userId))))
    : [];

  // Filter comments to only those made by friends
  const friendComments = allComments
    ? allComments.filter((c: any) => friendIds.includes(c.userId))
    : [];

  // Fetch friend info for display
  const [friendInfo, setFriendInfo] = useState<Record<string, { name: string; email: string }> | null>(null);
  useEffect(() => {
    async function fetchFriendInfo() {
      if (!friendIds || friendIds.length === 0) return;
      const users = await clerk.client.users.getUserList({ userId: friendIds });
      const info: Record<string, { name: string; email: string }> = {};
      users.forEach(u => {
        info[u.id] = {
          name: u.fullName || u.username || u.emailAddresses[0]?.emailAddress || u.id,
          email: u.emailAddresses[0]?.emailAddress || u.id,
        };
      });
      setFriendInfo(info);
    }
    fetchFriendInfo();
  }, [friendIds, clerk.client.users]);

  // Sort comments by timestamp descending
  const sortedComments = friendComments.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Friends Feed</h1>
      <div className="space-y-4">
        {sortedComments.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">No recent activity from your friends yet.</p>
          </div>
        )}
        {sortedComments.map((comment: any) => (
          <div key={comment._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-semibold">{friendInfo?.[comment.userId]?.name || comment.userId}</span>
                <span className="text-gray-500 ml-2">({friendInfo?.[comment.userId]?.email || comment.userId})</span>
              </div>
              <span className="text-sm text-gray-500">{new Date(comment.timestamp).toLocaleString()}</span>
            </div>
            <div className="mb-2">
              {comment.recipeId && <span className="text-blue-700 font-medium">Recipe: {comment.recipeId}</span>}
            </div>
            <div>
              <p>{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 