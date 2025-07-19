import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';
import { useUser } from '@clerk/clerk-expo';

const FeedScreen = () => {
  const { user } = useUser();
  const userId = user?.id;
  const friends = useQuery(api.friends.getFriends, userId ? { userId, status: 'accepted' } : 'skip');
  const allComments = useQuery(api.comments.getAll);

  // Defensive: always use [] if undefined
  const friendIds = Array.from(
    new Set((friends || []).map(f => (f.userId === userId ? f.friendId : f.userId)).filter(id => id !== userId))
  );

  const friendComments = (allComments || []).filter(c => friendIds.includes(c.userId));

  // Sort comments by timestamp descending
  const sortedComments = friendComments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Friends' Feed</Text>
      <FlatList
        data={sortedComments}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={styles.commentUser}>{item.userId}</Text>
            <Text style={styles.commentContent}>{item.content}</Text>
            <Text style={styles.commentTime}>{new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No activity from friends yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  commentItem: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  commentUser: { fontWeight: 'bold', marginBottom: 2 },
  commentContent: { fontSize: 15, marginBottom: 2 },
  commentTime: { fontSize: 12, color: '#888' },
  empty: { color: '#888', textAlign: 'center', marginVertical: 8 },
});

export default FeedScreen; 