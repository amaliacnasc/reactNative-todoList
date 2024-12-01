import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, FlatList, View, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Ícones
import api from '../../axios';

export default function List({ navigation }) {
  const [list, setList] = useState([]);

  // Buscar tarefas
  const fetchData = async () => {
    try {
      const response = await api.get(
        'tarefas/tasks'
        );
      setList(response.data);
    } catch (error) {
      console.error('Erro ao buscar as tarefas:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Atualizar tarefa
  const handleUpdate = (task) => {
    navigation.navigate('NewTask', { task, refreshList: fetchData }); // Passa fetchData para atualizar após edição
  };

  // Excluir tarefa
  const handleDelete = (id) => {
    Alert.alert(
      'Confirmação',
      'Tem certeza de que deseja excluir esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await api.delete(`/tarefas/task/delete/${id}`);
              fetchData(); // Atualiza lista após exclusão
              alert('Tarefa excluída com sucesso!');
            } catch (error) {
              console.error('Erro ao excluir a tarefa:', error);
              alert('Erro ao excluir a tarefa, tente novamente.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Adicionar nova tarefa
  const handleAdd = () => {
    navigation.navigate('NewTask', { refreshList: fetchData });
  };

  // Função para definir cor com base no tipo de tarefa
  const getCardStyle = (type) => {
    switch (type) {
      case 'home':
        return styles.homeCard;
      case 'work':
        return styles.workCard;
      case 'studies':
        return styles.studiesCard;
      case 'health':
        return styles.healthCard;
      default:
        return styles.defaultCard;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={list}
          renderItem={({ item }) => (
            <View style={[styles.item, getCardStyle(item.type)]}>
              <Ionicons
                name={
                  item.type === 'home'
                    ? 'home'
                    : item.type === 'work'
                    ? 'briefcase'
                    : item.type === 'studies'
                    ? 'school'
                    : 'heart'
                }
                size={24}
                color="#fff"
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                {item.content && <Text style={styles.content}>{item.content}</Text>}
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleUpdate(item)}>
                  <Ionicons name="pencil" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.trashIcon}>
                  <MaterialIcons name="delete" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Ionicons name="add" size={36} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  textContainer: { flex: 1, marginLeft: 10 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#757575' },
  content: { fontSize: 14, color: '#757575' },
  actions: { flexDirection: 'row' },
  trashIcon: { marginLeft: 15 },
  addButton: {
    backgroundColor: '#ffadad',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  icon: { marginRight: 10 },
  homeCard: { backgroundColor: '#ffadad', borderWidth: 0 },
  workCard: { backgroundColor: '#ffd6a5', borderWidth: 0 },
  studiesCard: { backgroundColor: '#fdffb6', borderWidth: 0 },
  healthCard: { backgroundColor: '#caffbf', borderWidth: 0 },
  defaultCard: { backgroundColor: '#9ae6b4', borderWidth: 0 },
});
