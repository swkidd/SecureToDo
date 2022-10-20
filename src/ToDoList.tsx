import React, {useReducer, useCallback} from 'react';
import {FlatList, View} from 'react-native';
import useToDoState from './hooks/useToDoState';
import ToDoItem from './ToDoItem';

const ToDoList = () => {
  const {toDoState, addToDo, checkToDo, deleteToDo} = useToDoState();
  const Item = useCallback(
    ({item}) => (
      <ToDoItem
        todo={item}
        onDelete={deleteToDo}
        onEdit={() => {}}
        onCheck={checkToDo}
      />
    ),
    [],
  );

  return (
    <View>
      <FlatList data={toDoState.todos} renderItem={Item} />
    </View>
  );
};

export default ToDoList;
