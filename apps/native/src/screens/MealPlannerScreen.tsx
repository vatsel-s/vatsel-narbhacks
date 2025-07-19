import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Button, TextInput, Platform } from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';
import DateTimePicker from '@react-native-community/datetimepicker';

const MealPlannerScreen = () => {
  const { userId } = useAuth();
  const mealPlans = useQuery(api.mealPlans.getUserMealPlans, userId ? { userId } : 'skip') || [];
  const allRecipes = useQuery(api.recipes.getAll) || [];
  const addMealPlan = useMutation(api.mealPlans.addMealPlan);
  const deleteMealPlan = useMutation(api.mealPlans.deleteMealPlan);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedRecipeId, setSelectedRecipeId] = useState('');

  const handleSchedule = async () => {
    if (!userId || !selectedRecipeId || !selectedDate) return;
    await addMealPlan({ userId, recipeId: selectedRecipeId, date: selectedDate });
    setModalVisible(false);
    setSelectedDate('');
    setSelectedRecipeId('');
  };

  const handleRemove = async (planId) => {
    await deleteMealPlan({ id: planId });
  };

  const handleDateChange = (event, selectedDateValue) => {
    setShowDatePicker(false);
    if (selectedDateValue) {
      setDate(selectedDateValue);
      setSelectedDate(selectedDateValue.toISOString().split('T')[0]);
    }
  };

  // Join mealPlans with recipe data
  const plansWithRecipe = mealPlans.map(plan => {
    const recipe = allRecipes.find(r => r._id === plan.recipeId);
    return { ...plan, recipeName: recipe ? recipe.name : 'Unknown Recipe' };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meal Planner</Text>
      <FlatList
        data={plansWithRecipe}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.planItem}>
            <View>
              <Text style={styles.planDate}>Date: {item.date.split('T')[0]}</Text>
              <Text style={styles.planRecipe}>Recipe: {item.recipeName}</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemove(item._id)}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No meal plans scheduled.</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Schedule a Recipe</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text>{selectedDate ? `Date: ${selectedDate}` : 'Pick Date'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}
            <Text style={styles.sectionTitle}>Select Recipe:</Text>
            <FlatList
              data={allRecipes}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={selectedRecipeId === item._id ? styles.selectedRecipe : styles.recipeOption}
                  onPress={() => setSelectedRecipeId(item._id)}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 150 }}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Schedule" onPress={handleSchedule} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  planItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  planDate: { fontSize: 15, fontWeight: '500' },
  planRecipe: { fontSize: 14 },
  remove: { color: 'red', fontWeight: 'bold', marginLeft: 16 },
  empty: { color: '#888', textAlign: 'center', marginVertical: 8 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#007AFF', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  fabText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: 'white', padding: 20, borderRadius: 8, width: '85%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 10 },
  recipeOption: { padding: 8, borderBottomWidth: 1, borderColor: '#eee' },
  selectedRecipe: { padding: 8, borderBottomWidth: 1, borderColor: '#007AFF', backgroundColor: '#e6f0ff' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});

export default MealPlannerScreen; 