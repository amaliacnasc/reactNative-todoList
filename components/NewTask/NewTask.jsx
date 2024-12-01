import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'; // Biblioteca para dropdown
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Ícones
import api from '../../axios';

export default function NewTask({ navigation }) {
  const route = useRoute();
  const task = route.params?.task || null;
  const refreshList = route.params?.refreshList || (() => {}); // Função de callback para atualizar a lista

  const [open, setOpen] = useState(false); // Controlar o estado de abertura do dropdown
  const [selectedTaskType, setSelectedTaskType] = useState(task?.type || null);
  const [taskTitle, setTaskTitle] = useState(task?.title || '');
  const [taskDetails, setTaskDetails] = useState(task?.content || '');

  // Tipos de tarefa diretamente do enum
  const taskTypes = [
    { label: 'Home', value: 'home' },
    { label: 'Work', value: 'work' },
    { label: 'Studies', value: 'studies' },
    { label: 'Health', value: 'health' },
  ];

  const handleSaveTask = async () => {
    if (!taskTitle || !selectedTaskType) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      if (task) {
        // Editar tarefa
        await api.put(`/tarefas/task/update/${task.id}`, {
          title: taskTitle,
          type: selectedTaskType,
          content: taskDetails,
        });
        Alert.alert('Sucesso', 'Tarefa atualizada com sucesso!');
      } else {
        // Criar nova tarefa
        await api.post('/tarefas', {
          title: taskTitle,
          type: selectedTaskType,
          content: taskDetails,
        });
        Alert.alert('Sucesso', 'Tarefa criada com sucesso!');
      }
      refreshList(); // Atualiza a lista de tarefas
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar a tarefa:', error);
      Alert.alert('Erro', 'Não foi possível salvar a tarefa.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={28}
          color="#fff"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</Text>
      </View>

      <Text style={styles.infoText}>
        {task ? 'Atualize os detalhes da tarefa existente.' : 'Adicione os detalhes para a nova tarefa.'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Título da Tarefa"
        value={taskTitle}
        onChangeText={setTaskTitle}
        placeholderTextColor="#aaa"
      />

      {/* Dropdown para Tipo de Tarefa */}
      <DropDownPicker
        open={open}
        setOpen={setOpen}
        value={selectedTaskType}
        setValue={setSelectedTaskType}
        items={taskTypes}
        placeholder="Selecione o Tipo"
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownList}
        placeholderStyle={{ color: '#aaa' }}
        arrowIconStyle={{ tintColor: '#fff' }}
        textStyle={{ color: '#333' }}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Detalhes da Tarefa"
        value={taskDetails}
        onChangeText={setTaskDetails}
        multiline
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
        <Text style={styles.saveButtonText}>
          {task ? 'Atualizar Tarefa' : 'Adicionar Tarefa'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffd6a5',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FFF3DE',
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdown: {
    backgroundColor: '#FFF3DE',
    borderColor: '#444',
    borderRadius: 10,
  },
  dropdownList: {
    backgroundColor: '#FFF3DE',
    borderColor: '#555',
  },
  saveButton: {
    backgroundColor: '#ffd6a5',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
