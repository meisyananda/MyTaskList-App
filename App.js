import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function App() {
  // --- STATE MANAGEMENT (P04) ---
  const [taskText, setTaskText] = useState('');
  const [taskList, setTaskList] = useState([]);

  // --- LOGIC FUNCTIONS ---

  // Tambah Task Baru (CRUD - Create & Validasi P05)
  const handleAddTask = () => {
    if (taskText.trim().length === 0) {
      Alert.alert('Input Kosong', 'Woi Bro, isi dulu tugasnya!');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
      // Memberikan prioritas acak untuk variasi UI (Bonus)
      priority: Math.random() > 0.7 ? 'Tinggi' : (Math.random() > 0.4 ? 'Sedang' : 'Rendah'),
    };

    setTaskList([newTask, ...taskList]); // Task baru muncul di paling atas
    setTaskText('');
    Keyboard.dismiss();
  };

  // Hapus Task (CRUD - Delete)
  const deleteTask = (id) => {
    setTaskList(taskList.filter((item) => item.id !== id));
  };

  // Mark as Done (Bonus)
  const toggleComplete = (id) => {
    setTaskList(
      taskList.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // --- UI COMPONENTS ---

  // Render Item untuk FlatList (P06)
  const renderTaskItem = ({ item }) => {
    // Tentukan warna berdasarkan prioritas
    const priorityColor = 
      item.priority === 'Tinggi' ? '#FF5252' : 
      item.priority === 'Sedang' ? '#FFC107' : '#03DAC6';

    return (
      <View style={[styles.taskCard, { borderLeftColor: priorityColor }]}>
        <TouchableOpacity 
          style={styles.taskInfo} 
          onPress={() => toggleComplete(item.id)}
        >
          <View style={[styles.circle, item.completed && styles.circleDone]} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.taskText, item.completed && styles.taskTextDone]}>
              {item.text}
            </Text>
            <Text style={[styles.priorityTag, { color: priorityColor }]}>
              {item.priority}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => deleteTask(item.id)}>
          <Text style={styles.deleteIcon}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header & Counter (Bonus) */}
      <View style={styles.header}>
        <Text style={styles.title}>MyTaskList</Text>
        <Text style={styles.subtitle}>
          {taskList.filter(t => t.completed).length} selesai dari {taskList.length} tugas
        </Text>
      </View>

      {/* List Dinamis (P06) */}
      <FlatList
        data={taskList}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🎉</Text>
            <Text style={styles.emptyText}>Semua tugas kelar! Waktunya mabar.</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Form Input (P05) */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputWrapper}
      >
        <TextInput
          style={styles.input}
          placeholder="Tambah tugas baru..."
          placeholderTextColor="#666"
          value={taskText}
          onChangeText={(text) => setTaskText(text)}
        />
        <TouchableOpacity onPress={handleAddTask}>
          <View style={styles.addBtn}>
            <Text style={styles.addBtnText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- STYLESHEET (P02 & P03) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Black midnight theme
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#BB86FC',
  },
  subtitle: {
    color: '#03DAC6',
    fontSize: 14,
    marginTop: 5,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Ruang ekstra untuk input bar
  },
  taskCard: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderLeftWidth: 5,
    // Shadow
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#BB86FC',
    marginRight: 15,
  },
  circleDone: {
    backgroundColor: '#03DAC6',
    borderColor: '#03DAC6',
  },
  taskText: {
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: '500',
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: '#555',
  },
  priorityTag: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
    letterSpacing: 1,
  },
  deleteIcon: {
    color: '#CF6679',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  inputWrapper: {
    position: 'absolute',
    bottom: 25,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 25,
    color: '#FFF',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  addBtn: {
    width: 54,
    height: 54,
    backgroundColor: '#BB86FC',
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addBtnText: {
    color: '#000',
    fontSize: 28,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 10,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
});