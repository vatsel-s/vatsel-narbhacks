"use client";

import { useQuery } from 'convex/react';
import { api } from "@packages/backend/convex/_generated/api";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { Id } from "convex/_generated/dataModel";

interface Friend {
  _id: string;
  friendId: string;
  dateConnected: string;
  status: "pending" | "accepted" | "rejected";
  userId: string;
}

interface NutritionGoal {
  _id: string;
  type: string;
  targetValue: number;
  unit: string;
  startDate: string;
  endDate?: string;
}

interface Comment {
  _id: string;
  mealPlanId: string;
  content: string;
  timestamp: string;
  likes?: number;
}

const ProfilePage = () => {
  const { user } = useUser();
  const userId = user?.id;
  const { clerk } = useClerk();

  const friends = useQuery(api.friends.getFriends, userId ? { userId } : "skip") as Friend[] | undefined;
  const nutritionGoals = useQuery(api.nutritionGoals.getUserNutritionGoals, userId ? { userId } : "skip") as NutritionGoal[] | undefined;
  // Remove comments query if not available
  // const comments = useQuery(api.comments.listComments, userId ? { userId } : "skip") as Comment[] | undefined;

  // Add friend form state
  const [friendEmail, setFriendEmail] = useState("");
  const [addFriendStatus, setAddFriendStatus] = useState<string | null>(null);
  const addFriend = useMutation(api.friends.addFriend);
  const updateFriendStatus = useMutation(api.friends.updateFriendStatus);

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddFriendStatus(null);
    if (!userId || !friendEmail) return;
    try {
      // Clerk frontend lookup
      const users = await clerk.client.users.getUserList({ emailAddress: [friendEmail] });
      if (!users || users.length === 0) {
        setAddFriendStatus("User not found");
        return;
      }
      const friendUserId = users[0].id;
      if (friendUserId === userId) {
        setAddFriendStatus("You cannot add yourself as a friend.");
        return;
      }
      await addFriend({ userId, friendId: friendUserId });
      setAddFriendStatus("Friend request sent!");
      setFriendEmail("");
    } catch (err: any) {
      setAddFriendStatus("Error: " + (err.message || "Could not add friend"));
    }
  };

  // Split friends into accepted, incoming, outgoing
  const acceptedFriends = friends?.filter(f => f.status === "accepted");
  const incomingRequests = friends?.filter(f => f.status === "pending" && f.friendId === userId);
  const outgoingRequests = friends?.filter(f => f.status === "pending" && f.userId === userId);

  const handleRespondToRequest = async (friendRecordId: string, status: "accepted" | "rejected") => {
    try {
      await updateFriendStatus({ friendId: friendRecordId as Id<"friends">, status });
    } catch (err) {
      // Optionally show error
    }
  };

  // Fetch friend user info (name/email) for all unique friend userIds
  const [friendInfo, setFriendInfo] = useState<Record<string, { name: string; email: string }> | null>(null);
  useEffect(() => {
    async function fetchFriendInfo() {
      if (!friends || friends.length === 0 || !clerk) return;
      const uniqueIds = Array.from(new Set([
        ...friends.map(f => f.userId),
        ...friends.map(f => f.friendId),
      ])).filter(id => id !== userId);
      if (uniqueIds.length === 0) return;
      // Use clerk.users instead of clerk.client.users
      const users = await clerk.users.getUserList({ userId: uniqueIds });
      const info: Record<string, { name: string; email: string }> = {};
      (users as any[]).forEach((u: any) => {
        info[u.id] = {
          name: u.fullName || u.username || u.emailAddresses[0]?.emailAddress || u.id,
          email: u.emailAddresses[0]?.emailAddress || u.id,
        };
      });
      setFriendInfo(info);
    }
    if (clerk) {
      fetchFriendInfo();
    }
  }, [friends, userId, clerk]);

  return (
    <div className="space-y-8">
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Friends</h2>
        {user && (
          <div className="mb-4">
            <p className="text-lg font-semibold">{user.fullName || user.username || user.emailAddresses[0]?.emailAddress}</p>
            <p className="text-gray-600">{user.emailAddresses[0]?.emailAddress}</p>
          </div>
        )}
      </section>
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Add a Friend</h2>
        <form onSubmit={handleAddFriend} className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
          <input
            type="email"
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.target.value)}
            placeholder="Friend's email"
            className="p-2 border rounded w-full sm:w-auto"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Friend
          </button>
        </form>
        {addFriendStatus && <p className="mt-2 text-sm text-green-600">{addFriendStatus}</p>}
      </section>
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Incoming Friend Requests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {incomingRequests?.length === 0 && <p className="text-gray-500">No incoming requests.</p>}
          {incomingRequests?.map((req) => (
            <div key={req._id} className="border p-4 rounded-lg flex flex-col gap-2">
              <p className="font-medium">From: {friendInfo?.[req.userId]?.name || req.userId} ({friendInfo?.[req.userId]?.email || req.userId})</p>
              <div className="flex gap-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => handleRespondToRequest(req._id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleRespondToRequest(req._id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Outgoing Friend Requests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outgoingRequests?.length === 0 && <p className="text-gray-500">No outgoing requests.</p>}
          {outgoingRequests?.map((req) => (
            <div key={req._id} className="border p-4 rounded-lg">
              <p className="font-medium">To: {friendInfo?.[req.friendId]?.name || req.friendId} ({friendInfo?.[req.friendId]?.email || req.friendId})</p>
              <p className="text-gray-500">Status: Pending</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Friends</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {acceptedFriends?.length === 0 && <p className="text-gray-500">No friends yet.</p>}
          {acceptedFriends?.map((friend) => {
            const friendId = friend.userId === userId ? friend.friendId : friend.userId;
            return (
              <div key={friend._id} className="border p-4 rounded-lg">
                <p className="font-medium">{friendInfo?.[friendId]?.name || friendId}</p>
                <p className="text-sm text-gray-500">{friendInfo?.[friendId]?.email || friendId}</p>
                <p className="text-sm text-gray-500">
                  Connected since: {new Date(friend.dateConnected).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      </section>
      {/*
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Recent Comments</h2>
        <div className="space-y-4">
          {comments?.map((comment) => (
            <div key={comment._id} className="border p-4 rounded-lg">
              <p className="mb-2">{comment.content}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Meal Plan: {comment.mealPlanId}</span>
                <span>{new Date(comment.timestamp).toLocaleString()}</span>
                {comment.likes !== undefined && (
                  <span>Likes: {comment.likes}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      */}
    </div>
  );
};

export default ProfilePage;