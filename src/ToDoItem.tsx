import React from 'react';
import {Text} from 'react-native';

const ToDoItem = props => {
  return <Text>{JSON.stringify(props)}</Text>;
};

export default ToDoItem;
