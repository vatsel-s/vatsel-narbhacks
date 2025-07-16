import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';
import { Id } from '@packages/backend/convex/_generated/dataModel';
import {
  Text,
  Button,
  Card,
  TextInput,
  List,
  Searchbar,
  Portal,
  Modal,
  HelperText,
  IconButton,
  MD3Colors,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

interface IngredientFormData {
  ingredientName: string;
  quantity: number;
  expirationDate: string;
}

interface IngredientDisplayData {
  _id: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  expirationDate: string;
  dateAdded: string;
}

interface IngredientData {
  name: string;
  unit: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  vitaminA?: number;
  vitaminC?: number;
  iron?: number;
  calcium?: number;
  sugar?: number;
  sodium?: number;
  potassium?: number;
  cholesterol?: number;
  saturatedFat?: number;
  transFat?: number;
  vitaminD?: number;
}

const initialFormState: IngredientFormData = {
  ingredientName: '',
  quantity: 1,
  expirationDate: new Date().toISOString(),
};

const PantryScreen = () => {
  const [formData, setFormData] = useState<IngredientFormData>(initialFormState);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Convex queries and mutations
  const ingredients = useQuery(api.inventory.getIngredients) as IngredientDisplayData[] | null;
  const addIngredient = useMutation(api.inventory.addIngredient);
  const deleteIngredient = useMutation(api.inventory.deleteIngredient);
  const allIngredients = useQuery(api.ingredients.getAll) as IngredientData[] | null;

  const selectedIngredient = allIngredients?.find(i => i.name === formData.ingredientName);
  const unit = selectedIngredient?.unit || 'unit';

  // Filter ingredients by search
  const filteredIngredients = allIngredients?.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    try {
      await addIngredient({
        ingredientName: formData.ingredientName,
        unit,
        quantity: formData.quantity,
        expirationDate: formData.expirationDate,
      });
      setFormData(initialFormState);
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add ingredient:', error);
    }
  };

  const handleDelete = async (ingredientId: string) => {
    try {
      await deleteIngredient({ ingredientId: ingredientId as Id<'inventory'> });
    } catch (error) {
      console.error('Failed to delete ingredient:', error);
    }
  };

  const getNutrition = (ingredientName: string) => {
    return allIngredients?.find((i) => i.name === ingredientName);
  };

  const renderNutritionInfo = (nutrition: IngredientData) => {
    const nutritionItems = [
      { label: 'Calories', value: nutrition.calories },
      { label: 'Protein', value: `${nutrition.protein}g` },
      { label: 'Carbs', value: `${nutrition.carbohydrates}g` },
      { label: 'Fat', value: `${nutrition.fat}g` },
      nutrition.fiber && { label: 'Fiber', value: `${nutrition.fiber}g` },
      nutrition.sugar && { label: 'Sugar', value: `${nutrition.sugar}g` },
      nutrition.sodium && { label: 'Sodium', value: `${nutrition.sodium}mg` },
      nutrition.calcium && { label: 'Calcium', value: `${nutrition.calcium}mg` },
    ].filter(Boolean);

    return (
      <View style={styles.nutritionGrid}>
        {nutritionItems.map((item, index) => (
          item && (
            <View key={index} style={styles.nutritionItem}>
              <Text variant="bodySmall">{item.label}:</Text>
              <Text variant="bodyMedium">{item.value}</Text>
            </View>
          )
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search ingredients..."
        onChangeText={setSearch}
        value={search}
        style={styles.searchBar}
      />

      <Button
        mode="contained"
        onPress={() => setShowAddModal(true)}
        style={styles.addButton}
      >
        Add Ingredient
      </Button>

      <ScrollView style={styles.list}>
        {ingredients?.map((ingredient) => {
          const isExpanded = expandedId === ingredient._id;
          const nutrition = getNutrition(ingredient.ingredientName);
          
          return (
            <Card
              key={ingredient._id}
              style={styles.card}
              onPress={() => setExpandedId(isExpanded ? null : ingredient._id)}
            >
              <Card.Content>
                <View style={styles.cardHeader}>
                  <View>
                    <Text variant="titleMedium">{ingredient.ingredientName}</Text>
                    <Text variant="bodyMedium">
                      {ingredient.quantity} {ingredient.unit}
                    </Text>
                    <Text variant="bodySmall">
                      Expires: {new Date(ingredient.expirationDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <IconButton
                    icon="delete"
                    mode="outlined"
                    onPress={() => handleDelete(ingredient._id)}
                  />
                </View>
                
                {isExpanded && nutrition && (
                  <View style={styles.nutritionContainer}>
                    <Text variant="titleSmall" style={styles.nutritionTitle}>
                      Nutrition Facts (per {nutrition.unit})
                    </Text>
                    {renderNutritionInfo(nutrition)}
                  </View>
                )}
              </Card.Content>
            </Card>
          );
        })}
      </ScrollView>

      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => setShowAddModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>Add Ingredient</Text>
          
          <List.Section>
            <List.Subheader>Select Ingredient</List.Subheader>
            <ScrollView style={styles.ingredientList}>
              {filteredIngredients?.map((item) => (
                <List.Item
                  key={item.name}
                  title={item.name}
                  description={`Unit: ${item.unit}`}
                  onPress={() => setFormData({ ...formData, ingredientName: item.name })}
                  left={props => (
                    <List.Icon
                      {...props}
                      icon={formData.ingredientName === item.name ? 'check' : 'food'}
                    />
                  )}
                />
              ))}
            </ScrollView>
          </List.Section>

          <TextInput
            label={`Quantity (${unit})`}
            value={formData.quantity.toString()}
            onChangeText={(text) => setFormData({ ...formData, quantity: Number(text) || 0 })}
            keyboardType="numeric"
            style={styles.input}
          />

          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            {new Date(formData.expirationDate).toLocaleDateString()}
          </Button>
          <HelperText type="info">Expiration Date</HelperText>

          {showDatePicker && (
            <DateTimePicker
              value={new Date(formData.expirationDate)}
              mode="date"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  setFormData({ ...formData, expirationDate: date.toISOString() });
                }
              }}
            />
          )}

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setShowAddModal(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.modalButton}
              disabled={!formData.ingredientName || formData.quantity <= 0}
            >
              Add
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    marginBottom: 16,
  },
  addButton: {
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  card: {
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nutritionContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  nutritionTitle: {
    marginBottom: 8,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  nutritionItem: {
    width: '50%',
    marginBottom: 4,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 16,
  },
  ingredientList: {
    maxHeight: 200,
  },
  input: {
    marginBottom: 16,
  },
  dateButton: {
    marginBottom: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    marginLeft: 8,
  },
});

export default PantryScreen; 