import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TaskListScreen from './src/screens/TaskListScreen';
import DailyTaskScreen from './src/screens/DailyTaskScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TaskList">
        <Stack.Screen name="TaskList" component={TaskListScreen} />
        <Stack.Screen name="DailyTask" component={DailyTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
