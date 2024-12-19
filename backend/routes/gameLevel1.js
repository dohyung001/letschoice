const express = require("express");
const mongoose = require("mongoose");
const router = express.Router(); // router 객체 생성
const Question2 = require("../models/Question2");


router.get("/questions2/random", async (req, res) => {
  try {
    const count = await Question2.countDocuments();
    console.log("문서 개수:", count);  // count 로그 추가
    if (count === 0) {
      return res.status(404).json({ message: "질문이 없습니다." });
    }


    const randomIndex = Math.floor(Math.random() * count);
    console.log("랜덤 인덱스:", randomIndex, "문서 개수:", count);

    const question2 = await Question2.findOne().skip(randomIndex);
    console.log('랜덤 질문:', question2); // 랜덤 질문 내용 로그 추가

    if (!question2) {
      return res.status(404).json({ message: "랜덤 질문을 가져오는 데 실패했습니다." });
    }

    // 데이터를 클라이언트로 반환
    res.status(200).json({
      photo: question2.photo,
      description: question2.description,
    });
  } catch (error) {
    console.error("질문 반환 실패:", error.message);
    res.status(500).json({ message: "서버 오류로 질문을 반환할 수 없습니다." });
  }
});

module.exports = router;
