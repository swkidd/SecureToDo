import React, {useCallback, useState, useEffect} from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Text,
} from 'react-native';
import useToDoState, {defaultToDo} from './hooks/useToDoState';
import ToDoItem from './ToDoItem';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import type {ToDo} from './hooks/useToDoState';
import colors from './colors';
import DateHeader from './DateHeader';
import {formatDate} from './utils';

const ToDoList = () => {
  const {
    toDoState,
    updateToDo,
    checkToDo,
    deleteToDo,
    loadDate,
    loadExistingDates,
  } = useToDoState();
  const [editing, setEditing] = useState<number | null>(null); // id of current editing todo
  const [newToDo, setNewToDo] = useState<ToDo>(defaultToDo);
  const [open, setOpen] = useState<boolean>(false); // calendar open/ close

  const [currentDate, setCurrentDate] = useState<Date>(new Date()); // current selected date

  useEffect(() => {
    loadExistingDates(); // load all dates that have a todo into toDoState.existingDates (used to show dots on the calendar)
  }, []);

  useEffect(() => {
    loadDate(currentDate); // load the todos for the current date
  }, [currentDate]);

  const createNewToDo = useCallback(() => {
    setNewToDo(c => {
      updateToDo({...c, date: formatDate(currentDate)});
      return defaultToDo;
    });
    Keyboard.dismiss();
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
      <DateHeader
        open={open}
        setOpen={setOpen}
        date={currentDate}
        setDate={setCurrentDate}
        existingDates={toDoState.existingDates}
      />
      <FlatList
        data={
          toDoState.todos
            .sort((a, b) => a.id - b.id)
            .filter(
              t => !editing || t.id === editing,
            ) /* only show the todo being editied */
        }
        renderItem={Item}
        removeClippedSubviews={false}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => (
          <Text style={styles.emptyContainerText}>Nothing for today...</Text>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={'New To Do...'}
          value={newToDo.text}
          onFocus={() => setOpen(false)} // close calendar on focus
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
  emptyContainerText: {
    textAlign: 'center',
  },
});

export default ToDoList;
