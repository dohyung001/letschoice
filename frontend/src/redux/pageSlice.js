import { createSlice } from '@reduxjs/toolkit';

//초기 값
const initialState = {
  selectedDifficulty: '중',
};

//페이지 헤더 관련 슬라이스
const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setDifficulty: (state, action) => {  // 선택한 난이도
      state.selectedDifficulty = action.payload;
    },
  },
});

export const { setDifficulty } = pageSlice.actions; // 액션 생성 함수
export default pageSlice.reducer; // 리듀서
