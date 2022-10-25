import {useReducer, useMemo, useCallback, useEffect} from 'react';
import {
  getAllObjectsByPrefix,
  deleteItem,
  setObject,
} from '../state/secureStorage';
import {formatDate, generateUUID} from '../utils';

export type ToDoAction = {
  type: 'LOAD' | 'UPDATE' | 'DELETE' | 'CHECK';
  payload: any;
};

export type ToDo = {id: string; text: string; checked: boolean; date: string};
export type ToDoState = {todos: ToDo[]; existingDates: string[]};

export const initialState: ToDoState = {todos: [], existingDates: []};
export const defaultToDo: ToDo = {
  id: '',
  text: '',
  checked: false,
  date: formatDate(new Date()),
};

// return a list of unique dates found in todos
const getDates = (todos: ToDo[]) => {
  const dates: Set<string> = new Set(todos.map(t => t.date));
  return [...dates].sort();
};

const toDoReducer = (state: ToDoState, action: ToDoAction) => {
  switch (action.type) {
    case 'LOAD': {
      return {...state, ...action.payload};
    }
    case 'UPDATE': {
      const todo = action.payload;
      // update existing dates, if date doesn't have a todo yet add it
      const existingDates = state.existingDates;
      if (!existingDates.includes(todo.date)) {
        existingDates.push(todo.date);
      }
      return {
        ...state,
        todos: [...state.todos.filter(t => t.id !== todo.id), todo],
        existingDates,
      };
    }
    case 'DELETE': {
      const todos = state.todos.filter(todo => todo.id !== action.payload.id);
      return {
        ...state,
        todos,
        existingDates: todos.length ? state.existingDates : [], // if deleting the last todo for a date, make existing dates empty
      };
    }
    case 'CHECK': {
      // toggle checked
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? {...todo, checked: !todo.checked}
            : todo,
        ),
      };
    }
    default: {
      return state;
    }
  }
};

const TODO_PREFIX = 'todo';
// key into storage for todos 
const makeToDoKey = (date: string, id?: string | number) =>
  `${TODO_PREFIX}.${date}.${id ?? ''}`;

const useToDoState = () => {
  const [toDoState, dispatch] = useReducer(toDoReducer, initialState);
 
  // load existingDates state, a list of all exisitng dates
  const loadExistingDates = useCallback(async () => {
    const todos = await getAllObjectsByPrefix(TODO_PREFIX);
    dispatch({type: 'LOAD', payload: { existingDates: getDates(todos as ToDo[]) }});
  }, []);

  const loadDate = useCallback(async (date: Date | string) => {
    let dateString = typeof date === 'string' ? date : formatDate(date);
    const key = makeToDoKey(dateString);
    const todos = await getAllObjectsByPrefix(key); // get all todos with date
    dispatch({type: 'LOAD', payload: { todos }});
  }, []);

  const updateToDo = useCallback(async (todo: ToDo) => {
    if (!todo.id) {
      todo.id = generateUUID() // if todo doesn't have an id (is new) add one
    }
    const key = makeToDoKey(todo.date, todo.id);
    await setObject(key, todo);
    dispatch({type: 'UPDATE', payload: todo});
  }, []);

  const deleteToDo = useCallback(async (todo: ToDo) => {
    const key = makeToDoKey(todo.date, todo.id);
    await deleteItem(key);
    dispatch({type: 'DELETE', payload: todo});
  }, []);

  const checkToDo = useCallback(async (todo: ToDo) => {
    const newToDo = {...todo, checked: !todo.checked};
    const key = makeToDoKey(todo.date, todo.id);
    await setObject(key, newToDo);
    dispatch({type: 'CHECK', payload: todo});
  }, []);

  return useMemo(
    () => ({
      toDoState,
      loadDate,
      loadExistingDates,
      updateToDo,
      deleteToDo,
      checkToDo,
    }),
    [toDoState],
  );
};

export default useToDoState;
