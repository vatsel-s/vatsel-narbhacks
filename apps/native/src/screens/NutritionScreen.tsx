import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Button, TextInput, Platform } from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';
import DateTimePicker from '@react-native-community/datetimepicker';

const NutritionScreen = () => {
  const { userId } = useAuth();
  const goals = useQuery(api.nutritionGoals.getUserNutritionGoals, userId ? { userId } : 'skip') || [];
  const addGoal = useMutation(api.nutritionGoals.addNutritionGoal);
  const deleteGoal = useMutation(api.nutritionGoals.deleteNutritionGoal);
  const nutritionCategories = useQuery(api.nutritionCategories.getAll) || [];

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ type: '', targetValue: '', unit: '', startDate: '', endDate: '' });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleAdd = async () => {
    if (!userId || !form.type || !form.targetValue || !form.unit || !form.startDate) return;
    await addGoal({
      userId,
      type: form.type,
      targetValue: Number(form.targetValue),
      unit: form.unit,
      startDate: form.startDate,
      endDate: form.endDate || undefined,
    });
    setForm({ type: '', targetValue: '', unit: '', startDate: '', endDate: '' });
    setModalVisible(false);
  };

  const handleDelete = async (goalId) => {
    await deleteGoal({ id: goalId });
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      setForm(f => ({ ...f, startDate: selectedDate.toISOString().split('T')[0] }));
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
      setForm(f => ({ ...f, endDate: selectedDate.toISOString().split('T')[0] }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nutrition Goals</Text>
      <FlatList
        data={goals}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <View>
              <Text style={styles.goalType}>{item.type}</Text>
              <Text>Target: {item.targetValue} {item.unit}</Text>
              <Text>Start: {item.startDate.split('T')[0]}</Text>
              {item.endDate && <Text>End: {item.endDate.split('T')[0]}</Text>}
            </View>
            <TouchableOpacity onPress={() => handleDelete(item._id)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No nutrition goals set.</Text>}
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
            <Text style={styles.modalTitle}>Add Nutrition Goal</Text>
            <Text style={styles.sectionTitle}>Type</Text>
            <FlatList
              data={nutritionCategories}
              keyExtractor={item => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={form.type === item.name ? styles.selectedType : styles.typeOption}
                  onPress={() => setForm(f => ({ ...f, type: item.name, unit: item.unit }))}
                >
                  <Text>{item.name} ({item.unit})</Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 100 }}
            />
            <TextInput
              style={styles.input}
              placeholder="Target Value"
              keyboardType="numeric"
              value={form.targetValue}
              onChangeText={text => setForm(f => ({ ...f, targetValue: text }))}
            />
            <TouchableOpacity style={styles.input} onPress={() => setShowStartPicker(true)}>
              <Text>{form.startDate ? `Start Date: ${form.startDate}` : 'Pick Start Date'}</Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleStartDateChange}
              />
            )}
            <TouchableOpacity style={styles.input} onPress={() => setShowEndPicker(true)}>
              <Text>{form.endDate ? `End Date: ${form.endDate}` : 'Pick End Date (optional)'}</Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleEndDateChange}
              />
            )}
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Add" onPress={handleAdd} />
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
  goalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  goalType: { fontSize: 16, fontWeight: '500' },
  delete: { color: 'red', fontWeight: 'bold', marginLeft: 16 },
  empty: { color: '#888', textAlign: 'center', marginVertical: 8 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#007AFF', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  fabText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: 'white', padding: 20, borderRadius: 8, width: '85%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 10 },
  typeOption: { padding: 8, borderBottomWidth: 1, borderColor: '#eee' },
  selectedType: { padding: 8, borderBottomWidth: 1, borderColor: '#007AFF', backgroundColor: '#e6f0ff' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});

export default NutritionScreen; 