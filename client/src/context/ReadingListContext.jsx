import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ReadingListContext = createContext();

const STORAGE_KEY = 'athena_reading_list';

const initialState = {
  items: [],
};

function readingListReducer(state, action) {
  switch (action.type) {
    case 'ADD_BOOK': {
      const bookExists = state.items.some((item) => item.id === action.payload.id);
      if (bookExists) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    case 'REMOVE_BOOK': {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    }
    case 'CLEAR_LIST': {
      return {
        ...state,
        items: [],
      };
    }
    default:
      return state;
  }
}

export function ReadingListProvider({ children }) {
  const [state, dispatch] = useReducer(readingListReducer, initialState, (defaultState) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { items: JSON.parse(saved) };
      }
    } catch (err) {
      console.error('Failed to load reading list from localStorage:', err);
    }
    return defaultState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch (err) {
      console.error('Failed to save reading list to localStorage:', err);
    }
  }, [state.items]);

  const addBook = (book) => {
    dispatch({ type: 'ADD_BOOK', payload: book });
  };

  const removeBook = (bookId) => {
    dispatch({ type: 'REMOVE_BOOK', payload: bookId });
  };

  const clearList = () => {
    dispatch({ type: 'CLEAR_LIST' });
  };

  return (
    <ReadingListContext.Provider
      value={{
        items: state.items,
        count: state.items.length,
        addBook,
        removeBook,
        clearList,
        dispatch,
      }}
    >
      {children}
    </ReadingListContext.Provider>
  );
}

export function useReadingList() {
  const context = useContext(ReadingListContext);
  if (!context) {
    throw new Error('useReadingList must be used within a ReadingListProvider');
  }
  return context;
}

export default ReadingListContext;
