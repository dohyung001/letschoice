// models/score.js
const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    roomname: { type: String, required: true }, // 방 이름
    gamelevel: { type: String, required: true, enum: ['하', '중', '상'] }, // 게임 난이도
    score1: { type: Number }, // 플레이어1 점수
    score2: { type: Number }, // 플레이어2 점수
    player1: { type: String, required: true }, // 플레이어1 이름
    player2: { type: String, required: true }, // 플레이어2 이름
    round: { type: Number },  // 라운드 정보 추가
    winner: { type: String }, // 승자 이름
    date: { type: Date, default: Date.now }, // 게임 날짜
}, {
    timestamps: true, // 생성 시간 및 업데이트 시간 자동 관리
});

module.exports = mongoose.model('Score', scoreSchema);