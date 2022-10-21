import React, {useCallback, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import type {ViewProps} from 'react-native';
import type {ToDo} from './hooks/useToDoState';

type PressableViewProps = ViewProps & {onPress?: () => void};
interface ToDoItemType {
  todo: ToDo;
  editing: boolean;
  onUpdate: (todo: ToDo) => Promise<void> | void;
  setEdit: (todo: ToDo) => void;
  onDelete: (todo: ToDo) => Promise<void> | void;
  onCheck: (todo: ToDo) => Promise<void> | void;
}

const TextOrInput = ({
  children,
  editing,
  value,
  setEdit,
  onUpdate,
  ...props
}) => {
  const [text, setText] = useState<string>(value ?? '');
  const inputRef = useRef<TextInput>(null);

  // save icon slide in animation
  let slideValue = useRef(new Animated.Value(0)).current;
  const slideIn = Animated.spring(slideValue, {
    toValue: 0,
    useNativeDriver: false,
  });
  const slideOut = Animated.timing(slideValue, {
    toValue: 1,
    duration: 200,
    useNativeDriver: false,
  });

  if (!editing) {
    return (
      <Text onPress={() => setEdit(true)} {...props}>
        {children}
      </Text>
    );
  }

  return (
    <View style={styles.inputRow}>
      <TextInput
        ref={inputRef}
        value={text}
        onChangeText={setText}
        onFocus={() => slideIn.start()}
        onBlur={() => {
          onUpdate(text);
          slideOut.start(() => setEdit(false));
        }}
        autoFocus
        multiline
        {...props}
      />
      <Animated.View
        style={{
          transform: [
            {
              translateX: slideValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 50],
              }),
            },
          ],
        }}
      >
        <TouchableOpacity onPress={() => inputRef.current?.blur?.()}>
          <FontAwesome5 name="save" size={24} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const ToDoItem = ({
  todo,
  editing,
  onUpdate,
  setEdit,
  onCheck,
}: ToDoItemType) => {
  const Icon = useCallback(
    (props: PressableViewProps) => {
      return (
        <FontAwesome5
          name={todo.checked ? 'check-circle' : 'circle'}
          size={24}
          color={todo.checked ? 'green' : 'black'}
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
        onUpdate={(text: string) => onUpdate({...todo, text})}
        style={styles.cardContent}
      >
        {todo.text?.length ? todo.text : 'Nothing to do...'}
      </TextOrInput>
    </View>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  card: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    padding: 0,
    margin: 0,
    fontSize: 16,
    flex: 1,
  },
  marginRight10: {
    marginRight: 10,
  },
});

export default ToDoItem;
