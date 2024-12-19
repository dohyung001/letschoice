import { configureStore } from '@reduxjs/toolkit';
import pageReducer from './pageSlice';
import authReducer from './authSlice';
import gameReducer from './gameSlice';
import roomReducer from './roomSlice';


const store = configureStore({
  reducer: {
    page: pageReducer,
    auth: authReducer,
    game: gameReducer,
    room: roomReducer,
  },
});

export default store;
