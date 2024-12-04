import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const loadTasks = async () => {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const storedPoints = await AsyncStorage.getItem('points');
      setTasks(storedTasks ? JSON.parse(storedTasks) : []);
      setPoints(storedPoints ? parseInt(storedPoints, 10) : 0);
    };

    loadTasks();
  }, []);

  const handleTaskComplete = async (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: true } : task
    );
    setTasks(updatedTasks);
    setPoints(points + 10);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    await AsyncStorage.setItem('points', points.toString());
  };

  const handleTaskUndo = async (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: false } : task
    );
    setTasks(updatedTasks);
    setPoints(points - 10);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    await AsyncStorage.setItem('points', points.toString());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мои задачи</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskText}>
              {item.completed ? '✅' : '⬜'} {item.title}
            </Text>
            {!item.completed ? (
              <Button
                title="Выполнить"
                onPress={() => handleTaskComplete(item.id)}
              />
            ) : (
              <Button
                title="Отменить"
                onPress={() => handleTaskUndo(item.id)}
                color="red"
              />
            )}
          </View>
        )}
      />
      <Text style={styles.points}>Очки: {points}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskText: {
    fontSize: 18,
  },
  points: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
