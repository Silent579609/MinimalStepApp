import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const tasks = [
  'Заправь кровать',
  'Выпей стакан воды',
  'Сделай 5 отжиманий',
  'Пойди на прогулку',
  'Прочитай 10 минут',
];

export default function HomeScreen() {
  const [task, setTask] = useState(null);

  // Функция для случайного выбора задачи
  const getTask = () => {
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    setTask(randomTask);
  };

  useEffect(() => {
    getTask();
  }, []); // Вызывается только при запуске приложения

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Задача на день:</Text>
      {task ? (
        <>
          <Text style={styles.task}>{task}</Text>
          <Button title="Выполнить" onPress={getTask} />
        </>
      ) : (
        <Text>Задача загружается...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  task: {
    fontSize: 18,
    marginBottom: 20,
  },
});
