import React, {useCallback, useState} from 'react';
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
import colors from './colors';

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
    <KeyboardAvoidingView style={styles.container}>
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
          <FontAwesome5 name="plus" size={36} color={colors.blizardBlue} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blizardBlue,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: colors.raisinBlack,
  },
  input: {
    backgroundColor: colors.white,
    flex: 1,
    margin: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default ToDoList;
