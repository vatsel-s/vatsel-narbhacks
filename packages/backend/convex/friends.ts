import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get a single friend relationship
export const getFriend = query({
  args: {
    userId: v.string(),
    friendId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("friends")
      .filter((q) => 
        q.or(
          q.and(
            q.eq(q.field("userId"), args.userId),
            q.eq(q.field("friendId"), args.friendId)
          ),
          q.and(
            q.eq(q.field("userId"), args.friendId),
            q.eq(q.field("friendId"), args.userId)
          )
        )
      )
      .first();
  },
});

// Get all friends for a user
export const getFriends = query({
  args: {
    userId: v.string(),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("friends")
      .filter((q) => 
        q.or(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("friendId"), args.userId)
        )
      );

    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    return await query.collect();
  },
});

// Add a friend request
export const addFriend = mutation({
  args: {
    userId: v.string(),
    friendId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if friendship already exists
    const existing = await ctx.db
      .query("friends")
      .filter((q) => 
        q.or(
          q.and(
            q.eq(q.field("userId"), args.userId),
            q.eq(q.field("friendId"), args.friendId)
          ),
          q.and(
            q.eq(q.field("userId"), args.friendId),
            q.eq(q.field("friendId"), args.userId)
          )
        )
      )
      .first();

    if (existing) {
      throw new Error("Friendship already exists");
    }

    return await ctx.db.insert("friends", {
      userId: args.userId,
      friendId: args.friendId,
      status: "pending",
      dateConnected: new Date().toISOString(),
    });
  },
});

//Update friend status
export const updateFriendStatus = mutation({
  args: {
    friendId: v.id("friends"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.friendId, {
      status: args.status,
      dateConnected: new Date().toISOString(),
    });
  },
});

// Remove friend
export const removeFriend = mutation({
  args: {
    friendId: v.id("friends"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.friendId);
  },
});