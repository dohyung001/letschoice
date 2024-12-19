const express = require("express");
const mongoose = require("mongoose");
const router = express.Router(); // router 객체 생성
const Question = require("../models/Question");

const app = express();

// 랜덤 질문을 가져오는 API
router.get("/questions/random", async (req, res) => {
    try {
        // 총 문서 개수 가져오기
        const count = await Question.countDocuments();
        if (count === 0) {
            return res.status(404).json({ message: "질문이 없습니다." });
        }

        // 랜덤 인덱스 생성
        const randomIndex = Math.floor(Math.random() * count);
        
        // 랜덤으로 하나의 문서 가져오기
        const question = await Question.findOne().skip(randomIndex);
        
        if (!question) {
            return res.status(404).json({ message: "랜덤 질문을 가져오는 데 실패했습니다." });
        }

        // 질문과 정답을 포함한 JSON 반환
        res.status(200).json({
            question: question.question,
            correctAnswer: question.correctAnswer
        });
    } catch (error) {
        console.error("질문 반환 실패:", error.message);
        res.status(500).json({ message: "서버 오류로 질문을 반환할 수 없습니다." });
    }
});

module.exports = router;
