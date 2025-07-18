import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';

const RecipesScreen = () => {
  const { userId } = useAuth();
  const allRecipes = useQuery(api.recipes.getAll) || [];
  const possibleData = useQuery(api.recipes.getPossibleRecipes, userId ? { userId } : 'skip');
  const markAsMade = useMutation(api.recipes.markAsMade);

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Recipes the user can make
  const possibleRecipes = possibleData?.possible || [];
  const almostRecipes = possibleData?.almost || [];

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  const handleMarkAsMade = async (recipeId) => {
    if (!userId) return;
    await markAsMade({ userId, recipeId });
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recipes You Can Make</Text>
      <FlatList
        data={possibleRecipes}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.recipeItem} onPress={() => handleSelectRecipe(item)}>
            <Text style={styles.recipeName}>{item.name}</Text>
            <Text style={styles.recipeTag}>Possible</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No recipes you can make right now.</Text>}
      />
      <Text style={styles.header}>Almost Possible Recipes</Text>
      <FlatList
        data={almostRecipes}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.recipeItem} onPress={() => handleSelectRecipe(item)}>
            <Text style={styles.recipeName}>{item.name}</Text>
            <Text style={[styles.recipeTag, { backgroundColor: '#FFD700', color: '#333' }]}>Almost</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No almost-possible recipes.</Text>}
      />
      <Text style={styles.header}>All Recipes</Text>
      <FlatList
        data={allRecipes}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.recipeItem} onPress={() => handleSelectRecipe(item)}>
            <Text style={styles.recipeName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No recipes found.</Text>}
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            {selectedRecipe && (
              <>
                <Text style={styles.modalTitle}>{selectedRecipe.name}</Text>
                <Text style={styles.sectionTitle}>Ingredients:</Text>
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <Text key={idx} style={styles.ingredient}>{ing.ingredientName} - {ing.quantity} {ing.unit}</Text>
                ))}
                <Text style={styles.sectionTitle}>Nutrition:</Text>
                {selectedRecipe.nutrition &&
                  typeof selectedRecipe.nutrition === 'object' &&
                  Object.entries(selectedRecipe.nutrition).map(([key, value]) => (
                    <Text key={key} style={styles.nutrition}>{key}: {String(value)}</Text>
                  ))}
                <View style={styles.modalButtons}>
                  <Button title="Close" onPress={() => setModalVisible(false)} />
                  <Button title="Mark as Made" onPress={() => handleMarkAsMade(selectedRecipe._id)} />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  recipeItem: { padding: 12, borderBottomWidth: 1, borderColor: '#eee', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  recipeName: { fontSize: 16, fontWeight: '500' },
  recipeTag: { backgroundColor: '#4CAF50', color: '#fff', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, fontSize: 12, marginLeft: 8 },
  empty: { color: '#888', textAlign: 'center', marginVertical: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: 'white', padding: 20, borderRadius: 8, width: '85%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', marginTop: 10 },
  ingredient: { fontSize: 14, marginLeft: 8 },
  nutrition: { fontSize: 13, marginLeft: 8 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
});

export default RecipesScreen; 