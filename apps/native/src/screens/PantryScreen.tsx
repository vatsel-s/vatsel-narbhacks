import React, { useState } from 'react';
import { View, FlatList, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';

const PantryScreen = () => {
  const [search, setSearch] = useState('');
  const [addVisible, setAddVisible] = useState(false);
  const [form, setForm] = useState({ ingredientName: '', quantity: 1, unit: '', expirationDate: '' });

  const ingredients = useQuery(api.inventory.getIngredients) || [];
  const allIngredients = useQuery(api.ingredients.getAll) || [];
  const addIngredient = useMutation(api.inventory.addIngredient);
  const deleteIngredient = useMutation(api.inventory.deleteIngredient);

  // Filtered list
  const filtered = ingredients.filter(item => item.ingredientName.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async () => {
    if (!form.ingredientName || !form.quantity || !form.unit || !form.expirationDate) return;
    await addIngredient({
      ingredientName: form.ingredientName,
      quantity: Number(form.quantity),
      unit: form.unit,
      expirationDate: form.expirationDate,
    });
    setForm({ ingredientName: '', quantity: 1, unit: '', expirationDate: '' });
    setAddVisible(false);
  };

  const handleDelete = async (ingredientId) => {
    await deleteIngredient({ ingredientId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Pantry</Text>
      <TextInput
        style={styles.search}
        placeholder="Search ingredients..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View>
              <Text style={styles.ingredientName}>{item.ingredientName} ({item.quantity} {item.unit})</Text>
              <Text style={styles.expiration}>Expires: {item.expirationDate}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item._id)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => setAddVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      <Modal
        visible={addVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add Ingredient</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingredient Name"
              value={form.ingredientName}
              onChangeText={text => {
                setForm(f => ({ ...f, ingredientName: text }));
                const found = allIngredients.find(i => i.name === text);
                setForm(f => ({ ...f, unit: found ? found.unit : '' }));
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              keyboardType="numeric"
              value={form.quantity.toString()}
              onChangeText={text => setForm(f => ({ ...f, quantity: Number(text) }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Unit"
              value={form.unit}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Expiration Date (YYYY-MM-DD)"
              value={form.expirationDate}
              onChangeText={text => setForm(f => ({ ...f, expirationDate: text }))}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setAddVisible(false)} />
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
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  search: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 12 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  ingredientName: { fontSize: 16, fontWeight: '500' },
  expiration: { fontSize: 12, color: '#888' },
  delete: { color: 'red', fontWeight: 'bold', marginLeft: 16 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#007AFF', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  fabText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: 'white', padding: 20, borderRadius: 8, width: '85%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 10 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});

export default PantryScreen; 