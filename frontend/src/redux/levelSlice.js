import { createSlice } from '@reduxjs/toolkit';

// 초기 방 설정
const initialState = {
  rooms: [
    {
      id: 1,
      name: '예시 방',
      isPasswordProtected: true,
      password: '1234',
      participants: 1,
      difficulty: '중',
    },
    {
      id: 2,
      name: '공개 방',
      isPasswordProtected: false,
      password: '',
      participants: 2,
      difficulty: '중',
    },
  ],
  selectedGameLevel: "", // 선택된 게임 난이도 추가
};

const levelSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setGamelevel: (state, action) => { // 게임 난이도 설정
      state.selectedGameLevel = action.payload;
    },
  },
});

export const { setGamelevel } = levelSlice.actions;
export default levelSlice.reducer;
