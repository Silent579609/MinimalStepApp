import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar } from 'react-native-paper';

const initialTasks = [
  'Заправь кровать',
  'Выпей стакан воды',
  'Сделай 5 отжиманий',
  'Пойди на прогулку',
  'Прочитай 10 минут',
];

const quotes = [
  'Маленькие шаги ведут к большим успехам!',
  'Верь в себя — ты способен на большее!',
  'Каждая задача — это шаг к лучшей версии себя.',
  'Действие — это ключ к успеху!',
  'У тебя всё получится!',
];

export default function TaskListScreen({ navigation }) {
  const [points, setPoints] = useState(0);
  const [tasksList, setTasksList] = useState(initialTasks.map(task => ({ title: task, completed: false })));
  const [quote, setQuote] = useState('');
  const dailyGoal = 5;
  const [dailyTasks, setDailyTasks] = useState(0);

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

  const handleTaskCompletion = async (index) => {
    if (tasksList[index].completed) {
      return;
    }
    const updatedTasks = [...tasksList];
    updatedTasks[index].completed = true;
    setTasksList(updatedTasks);

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

  const progress = Math.min(dailyTasks / dailyGoal, 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Список задач:</Text>
      <Text style={styles.points}>Очки: {points}</Text>

      <ScrollView style={styles.taskList}>
        {tasksList.map((task, index) => (
          <View key={index} style={styles.taskItem}>
            <Text style={[styles.taskText, task.completed && styles.completed]}>
              {task.title}
            </Text>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => handleTaskCompletion(index)}
            >
              <Text style={styles.buttonText}>Выполнить</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Text style={styles.quote}>{quote}</Text>

      <Text style={styles.dailyProgress}>
        Выполнено задач: {dailyTasks} / {dailyGoal}
      </Text>

      <ProgressBar
        progress={progress}
        style={styles.progressBar}
        color={progress < 1 ? '#FFD700' : '#4CAF50'}
      />

      <TouchableOpacity
        style={styles.viewTaskButton}
        onPress={() => navigation.navigate('DailyTask')}
      >
        <Text style={styles.buttonText}>Перейти к задаче дня</Text>
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
  points: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    position: 'absolute',
    top: 20,
    right: 20,
  },
  taskList: {
    flex: 1,
    marginTop: 10,
  },
  taskItem: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: {
    fontSize: 16,
    color: '#ddd',
    flex: 1,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#ddd',
    marginVertical: 10,
    textAlign: 'center',
  },
  dailyProgress: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 10,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginTop: 10,
  },
  viewTaskButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
});
