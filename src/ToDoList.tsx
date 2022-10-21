import React, {useCallback, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import useToDoState from './hooks/useToDoState';
import ToDoItem from './ToDoItem';

const ToDoList = () => {
  const {toDoState, updateToDo, checkToDo, deleteToDo} = useToDoState();
  const [editing, setEditing] = useState<string | null>(null);

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
    <View style={styles.margin10}>
      <FlatList
        data={toDoState.todos}
        renderItem={Item}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  margin10: {
    margin: 10,
  },
});

export default ToDoList;
