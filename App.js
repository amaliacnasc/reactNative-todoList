import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import List from './components/List/List'; // O seu componente de lista
import NewTask from './components/NewTask/NewTask'; // O componente de nova tarefa

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="List">
        <Stack.Screen name="List" component={List} />
        <Stack.Screen name="NewTask" component={NewTask} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
