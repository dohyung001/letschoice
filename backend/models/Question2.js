const mongoose = require("mongoose");

const Question2Schema = new mongoose.Schema({
    photo: { type: String, required: true },
    description: { type: String, required: true },
  }, { collection: "questions2" }); // 명시적으로 컬렉션 이름 설정
  

module.exports = mongoose.model("Question2", Question2Schema, "questions2");