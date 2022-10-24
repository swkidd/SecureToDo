import React, {useCallback, useState, useRef} from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import useToDoState, {defaultToDo} from './hooks/useToDoState';
import ToDoItem from './ToDoItem';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import type {ToDo} from './hooks/useToDoState';

const ToDoList = () => {
  const {toDoState, updateToDo, checkToDo, deleteToDo} = useToDoState();
  const [editing, setEditing] = useState<number | null>(null);
  const [newToDo, setNewToDo] = useState<ToDo>(defaultToDo);

  const createNewToDo = useCallback(() => {
    const newId = Math.max(...toDoState.todos.map(t => parseInt(t.id))) + 1;
    setNewToDo(c => {
      updateToDo({...c, id: newId});
      return defaultToDo;
    });
  }, [toDoState.todos]);

  const Item = useCallback(
    ({item}) => (
      <ToDoItem
        editing={editing === item.id}
        todo={item}
        onUpdate={updateToDo}
        onDelete={deleteToDo}
        setEdit={isEdit => setEditing(isEdit ? item.id : null)}
        onCheck={checkToDo}
      />
    ),
    [editing],
  );

  return (
    <KeyboardAvoidingView style={[styles.margin10, styles.flex1]}>
      <FlatList
        style={styles.flex1}
        data={toDoState.todos
          .sort((a, b) => a.id - b.id)
          .filter(t => !editing || t.id === editing)}
        renderItem={Item}
        removeClippedSubviews={false}
        keyExtractor={item => item.id}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={'New todo...'}
          value={newToDo.text}
          onChangeText={text => setNewToDo(c => ({...c, text}))}
        />
        <TouchableOpacity onPress={() => createNewToDo()}>
          <FontAwesome5 name="plus" size={36} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  margin10: {
    margin: 10,
  },
  flex1: {
    flex: 1,
  },
  inputContainer: {flexDirection: 'row', alignItems: 'center', padding: 5},
  input: {
    flex: 1,
    borderWidth: 1,
    margin: 5,
    marginRight: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});

export default ToDoList;
