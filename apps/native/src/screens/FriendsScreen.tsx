import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Button } from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';
import { useAuth, useUser } from '@clerk/clerk-expo';

const FriendsScreen = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  const friends = useQuery(api.friends.getFriends, userId ? { userId } : 'skip') || [];
  const addFriend = useMutation(api.friends.addFriend);
  const updateFriendStatus = useMutation(api.friends.updateFriendStatus);

  const [friendEmail, setFriendEmail] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  // Split friends into accepted, incoming, outgoing
  const acceptedFriends = friends.filter(f => f.status === 'accepted');
  const incomingRequests = friends.filter(f => f.status === 'pending' && f.friendId === userId);
  const outgoingRequests = friends.filter(f => f.status === 'pending' && f.userId === userId);

  const handleAddFriend = async () => {
    setStatusMsg('');
    if (!userId || !friendEmail) return;
    try {
      // In a real app, you would look up the user by email using Clerk's API
      // For now, just send the email as friendId (placeholder logic)
      await addFriend({ userId, friendId: friendEmail });
      setStatusMsg('Friend request sent!');
      setFriendEmail('');
    } catch (err) {
      setStatusMsg('Error: Could not add friend');
    }
  };

  const handleRespond = async (friendRecordId, status) => {
    await updateFriendStatus({ friendId: friendRecordId, status });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Friends</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter friend's email"
        value={friendEmail}
        onChangeText={setFriendEmail}
      />
      <Button title="Send Friend Request" onPress={handleAddFriend} />
      {statusMsg ? <Text style={styles.statusMsg}>{statusMsg}</Text> : null}
      <Text style={styles.sectionTitle}>Incoming Requests</Text>
      <FlatList
        data={incomingRequests}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Text>{item.userId}</Text>
            <View style={styles.row}>
              <Button title="Accept" onPress={() => handleRespond(item._id, 'accepted')} />
              <Button title="Reject" onPress={() => handleRespond(item._id, 'rejected')} />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No incoming requests.</Text>}
      />
      <Text style={styles.sectionTitle}>Outgoing Requests</Text>
      <FlatList
        data={outgoingRequests}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Text>{item.friendId}</Text>
            <Text style={styles.pending}>Pending</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No outgoing requests.</Text>}
      />
      <Text style={styles.sectionTitle}>Accepted Friends</Text>
      <FlatList
        data={acceptedFriends}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Text>{item.userId === userId ? item.friendId : item.userId}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No friends yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 10 },
  statusMsg: { color: 'green', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 4 },
  friendItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
  row: { flexDirection: 'row', gap: 8 },
  pending: { color: '#888', marginLeft: 8 },
  empty: { color: '#888', textAlign: 'center', marginVertical: 8 },
});

export default FriendsScreen; 