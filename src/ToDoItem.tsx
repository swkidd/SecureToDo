import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import TextOrInput from './TextOrInput';

import type {ViewProps} from 'react-native';
import type {ToDo} from './hooks/useToDoState';
import colors from './colors';

type PressableViewProps = ViewProps & {onPress?: () => void};
interface ToDoItemType {
  todo: ToDo;
  editing: boolean;
  onUpdate: (todo: ToDo) => Promise<void> | void;
  setEdit: (isEdit: boolean) => void;
  onDelete: (todo: ToDo) => Promise<void> | void;
  onCheck: (todo: ToDo) => Promise<void> | void;
}

const ToDoItem = ({
  todo,
  editing,
  onUpdate,
  onDelete,
  setEdit,
  onCheck,
}: ToDoItemType) => {
  const Icon = useCallback(
    (props: PressableViewProps) => {
      return (
        <FontAwesome5
          name={todo.checked ? 'check-circle' : 'circle'}
          size={24}
          color={todo.checked ? colors.raisinBlack : colors.blizardBlue}
          {...props}
        />
      );
    },
    [todo.checked],
  );

  return (
    <View style={styles.card}>
      <Icon style={styles.marginRight10} onPress={() => onCheck(todo)} />
      <TextOrInput
        todo={todo}
        value={todo.text}
        editing={editing}
        setEdit={setEdit}
        onUpdateText={(text: string) => onUpdate({...todo, text})}
        onDelete={() => onDelete(todo)}
        style={styles.cardContent}
      >
        {todo.text?.length ? todo.text : 'Nothing to do...'}
      </TextOrInput>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.white,
    backgroundColor: colors.white,
  },
  cardContent: {
    padding: 0,
    margin: 0,
    fontSize: 16,
    flex: 1,
    height: 24,
  },
  marginRight10: {
    marginRight: 10,
  },
});

export default ToDoItem;
