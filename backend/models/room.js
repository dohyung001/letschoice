const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomname: { type: String, required: true, unique: true }, // 방 이름
  gamelevel: { 
    type: String, 
    required: true, 
    enum: ['하', '중', '상'] // 게임 레벨 고정 값
  }, 
  password: { 
    type: String, 
    required: function () { return this.isPasswordProtected; } // 비밀번호 보호 활성화 시 필수
  }, 
  player1: { type: String, ref: 'User' }, // 첫 번째 플레이어 ID
  player2: { type: String, ref: 'User' }, // 두 번째 플레이어 ID
  isPasswordProtected: { type: Boolean, required: true },
  currentPlayers: { type: Number, default: 0 }, // 현재 방의 플레이어 수
},
 {
  timestamps: true, // 생성 시간 및 업데이트 시간 자동 관리
});

module.exports = mongoose.model('Room', roomSchema);
