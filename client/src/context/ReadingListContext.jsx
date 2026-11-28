import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ReadingListContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_BOOK':
      return [...state, action.payload];
    case 'REMOVE_BOOK':
      return state.filter((b) => b.id !== action.payload);
    case 'CLEAR_LIST':
      return [];
    default:
      return state;
  }
}

export function ReadingListProvider({ children }) {
  const [readingList, dispatch] = useReducer(
    reducer,
    [],
    () => JSON.parse(localStorage.getItem('readingList')) || [],
  );

  useEffect(() => {
    localStorage.setItem('readingList', JSON.stringify(readingList));
  }, [readingList]);

  return (
    <ReadingListContext.Provider
      value={{
        readingList,
        items: readingList,
        count: readingList.length,
        dispatch,
      }}
    >
      {children}
    </ReadingListContext.Provider>
  );
}

export const useReadingList = () => useContext(ReadingListContext);

export { ReadingListContext, reducer };
export default ReadingListContext;
