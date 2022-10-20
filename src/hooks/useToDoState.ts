import { useReducer, useMemo, useCallback, useEffect } from 'react'
import { getAllObjectsByPrefix, deleteItem, setObject } from "../state/secureStorage";

export type ToDoAction = {
  type: 'LOAD' | 'ADD' | 'DELETE' | 'EDIT' | 'CHECK';
  payload: any;
};

export type ToDo = {id: number; text: string; checked: boolean};
export type ToDoState = {todos: ToDo[]};

export const initialState: ToDoState = { todos: [] }

const toDoReducer = (state: ToDoState, action: ToDoAction) => {
  switch (action.type) {
    case 'LOAD': {
      return { ...state, 
        todos: [...action.payload]
      }
    } 
    case 'ADD': {
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    }
    case 'DELETE': {
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id),
      };
    }
    case 'EDIT': {
      // implement editing
      return state
    }
    case 'CHECK': {
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

const makeToDoKey = (id:string | number) => `todo.${id}`

const useToDoState = () => {
  const [toDoState, dispatch] = useReducer(toDoReducer, initialState);

  useEffect(() => {
    const loadToDos = async () => {
        const todos = await getAllObjectsByPrefix('todo.')
        const mocks = [
            { id: 1, text: 'todo 1', checked: false }
        ]
        dispatch({ type: 'LOAD', payload: [...mocks, ...todos] })
    }
    loadToDos()
  }, [])

  const addToDo = useCallback(async (todo: ToDo) => {
    const key = makeToDoKey(todo.id)
    await setObject(key, todo)
    dispatch({ type: 'ADD', payload: todo })
  }, [])

  const deleteToDo = useCallback(async (todo: ToDo) => {
      const key = makeToDoKey(todo.id)
      await deleteItem(key)
      dispatch({ type: 'DELETE', payload: todo })
  }, [])
  
  const checkToDo = useCallback(async (todo: ToDo) => {
      const newToDo = {...todo, checked: !todo.checked}
      const key = makeToDoKey(todo.id)
      await setObject(key, newToDo)
      dispatch({ type: 'CHECK', payload: todo })
  }, [])

  return useMemo(() => ({
    toDoState,
    addToDo,
    deleteToDo,
    checkToDo
  }), [toDoState])
}

export default useToDoState