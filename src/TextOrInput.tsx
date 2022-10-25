import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import colors from './colors';

/* Stateless (mostly) component to how either a Text or TextInput component based on editing prop
   clicking Text sets editing to true (calls setEdit(true))
*/
const TextOrInput = ({
  children,
  editing,
  value,
  setEdit,
  onUpdateText,
  onDelete,
  ...props
}) => {
  const [text, setText] = useState<string>(value ?? ''); // store local state to prevent updating local storage everytime text changes
  const inputRef = useRef<TextInput>(null);

  // save icon slide in animation
  let slideValue = useRef(new Animated.Value(1)).current;
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
      <View style={styles.inputRow}>
        <Text onPress={() => setEdit(true)} {...props}>
          {children}
        </Text>
        <TouchableOpacity onPress={onDelete}>
          <FontAwesome5 name="times" size={16} color={colors.blizardBlue} />
        </TouchableOpacity>
      </View>
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
          onUpdateText(text); // save on blur
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
          <FontAwesome5 name="save" size={24} color={colors.blizardBlue} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
});

export default TextOrInput;
