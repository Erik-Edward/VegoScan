import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../App';

type ResultScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Result'>;
  route: RouteProp<RootStackParamList, 'Result'>;
};

export function ResultScreen({ navigation, route }: ResultScreenProps) {
  const { isVegan, ingredients, explanation } = route.params;

  return (
    <View style={styles.container}>
      <View style={[
        styles.resultBanner,
        { backgroundColor: isVegan ? '#4CAF50' : '#F44336' }
      ]}>
        <Text style={styles.resultText}>
          {isVegan ? 'Vegansk' : 'Ej Vegansk'}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Ingredienser:</Text>
        {ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredient}>
            • {ingredient}
          </Text>
        ))}

        {explanation && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Förklaring:</Text>
            <Text style={styles.explanation}>{explanation}</Text>
          </>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Scan')}
        >
          <Text style={styles.buttonText}>Scanna Ny Produkt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  resultBanner: {
    padding: 20,
    alignItems: 'center',
  },
  resultText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  explanation: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: '#fff',
    elevation: 4,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});