import { createSlice } from '@reduxjs/toolkit';

//초기 방 설정
const initialState = {
  rooms: [
    {
      id: 1,
      name: '예시 방',
      isPasswordProtected: true,
      password: '1234',
      participants: 1,
      difficulty: '중'
    },
    {
      id: 2,
      name: '공개 방',
      isPasswordProtected: false,
      password:"",
      participants: 2,
      difficulty: '중'
    },
  ],
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRooms: (state, action) => {  //방 설정
      console.log(1212);
      state.rooms = action.payload;
    },
    addRoom: (state, action) => {   //방 추가
      state.rooms.push(action.payload);
    },
  },
});

export const { setRooms, addRoom} = roomSlice.actions;
export default roomSlice.reducer;
