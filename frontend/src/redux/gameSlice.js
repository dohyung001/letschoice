import { createSlice } from '@reduxjs/toolkit';

// 초기 상태
const initialState = {
  originalWords: ["고양이랑", "체스를", "다람쥐가", "한다.", "그리고", "그리고1", "그리고2", "그리고3", "그리고4", "그리고5", "그리고6",], // 원래 문장의 단어 배열
  words: [],         // 무작위로 섞인 단어 배열
  answers: [],       // 사용자가 드래그한 결과
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setWords: (state, action) => {
      state.originalWords = action.payload; // 원래 문장 저장
      state.words = [...action.payload];    // 복사 후 섞기
      for (let i = state.words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state.words[i], state.words[j]] = [state.words[j], state.words[i]];
      }
    },
    addWordToAnswers: (state, action) => {
      const { word, destinationIndex } = action.payload;
      state.words = state.words.filter((w) => w !== word);
      state.answers.splice(destinationIndex, 0, word);
    },
    removeWordFromAnswers: (state, action) => {
      const { word, sourceIndex } = action.payload;
      state.answers.splice(sourceIndex, 1);
      state.words.push(word);
    },
    reorderAnswers: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const [movedWord] = state.answers.splice(sourceIndex, 1);
      state.answers.splice(destinationIndex, 0, movedWord);
    },
    resetRound: (state) => {
      // 다음 라운드 시작 시 words와 answers 초기화
      state.words = [];
      state.answers = [];
    },
  },
});

export const {
  setWords,
  addWordToAnswers,
  removeWordFromAnswers,
  reorderAnswers,
  resetRound, // 새로 추가한 액션
} = gameSlice.actions;

export default gameSlice.reducer;

