import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const quotes = [
  'Маленькие шаги ведут к большим успехам!',
  'Верь в себя — ты способен на большее!',
  'Каждая задача — это шаг к лучшей версии себя.',
  'Действие — это ключ к успеху!',
  'У тебя всё получится!',
];

export default function DailyTaskScreen({ navigation }) {
  const [quote, setQuote] = useState('');
  const [completed, setCompleted] = useState(false);
  const [dailyTasks, setDailyTasks] = useState(0);
  const [points, setPoints] = useState(0);

  const dailyGoal = 1;

  const loadInitialData = async () => {
    const storedDailyTasks = await AsyncStorage.getItem('dailyTasks');
    const storedPoints = await AsyncStorage.getItem('points');
    if (storedDailyTasks) setDailyTasks(parseInt(storedDailyTasks, 10));
    if (storedPoints) setPoints(parseInt(storedPoints, 10));
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleTaskCompletion = async () => {
    if (completed) {
      Alert.alert('Задача уже выполнена', 'Вы не можете выполнить эту задачу дважды.');
      return;
    }

    setCompleted(true);

    if (dailyTasks < dailyGoal) {
      const newDailyTasks = dailyTasks + 1;
      setDailyTasks(newDailyTasks);
      await AsyncStorage.setItem('dailyTasks', newDailyTasks.toString());
    }

    const newPoints = points + 10;
    setPoints(newPoints);
    await AsyncStorage.setItem('points', newPoints.toString());

    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Задача дня:</Text>
      <Text style={styles.quote}>{quote}</Text>

      <TouchableOpacity
        style={styles.completeButton}
        onPress={handleTaskCompletion}
      >
        <Text style={styles.buttonText}>Выполнить</Text>
      </TouchableOpacity>

      <Text style={styles.dailyProgress}>Задачи выполнено: {dailyTasks} / {dailyGoal}</Text>

      <TouchableOpacity
        style={styles.viewTaskButton}
        onPress={() => navigation.navigate('TaskList')}
      >
        <Text style={styles.buttonText}>Перейти к списку задач</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#ddd',
    marginVertical: 10,
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dailyProgress: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 20,
    textAlign: 'center',
  },
  viewTaskButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
});
