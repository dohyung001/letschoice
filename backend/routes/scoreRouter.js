const express = require('express');
const router = express.Router();
const Score = require('../models/score');
const moment = require('moment');
const User = require('../models/user');
const Room = require('../models/room');


// 최종 스코어 및 승자 조회 라우터
router.get("/finalResult/:roomId", async (req, res) => {
    try {
        const { roomId } = req.params;

        // 해당 방의 스코어 데이터 조회
        const scores = await Score.find({ roomId });

        if (!scores || scores.length === 0) {
            return res.status(404).json({ message: "해당 방의 스코어가 없습니다." });
        }

        // 플레이어별 승리 횟수 계산
        let player1Wins = 0;
        let player2Wins = 0;

        scores.forEach((score) => {
            if (score.winner === score.player1) {
                player1Wins++;
            } else if (score.winner === score.player2) {
                player2Wins++;
            }
        });

        // 최종 승자 결정
        let finalWinner = null;
        if (player1Wins >= 4) {
            finalWinner = scores[0].player1; // player1의 이름
        } else if (player2Wins >= 4) {
            finalWinner = scores[0].player2; // player2의 이름
        }

        // 응답 전송
        res.json({
            roomname,
            gamelevel: scores[0].gamelevel,
            totalGames: scores.length,
            player1: scores[0].player1,
            player2: scores[0].player2,
            player1Wins,
            player2Wins,
            finalWinner: finalWinner || "아직 결정되지 않음",
        });
    } catch (error) {
        console.error("최종 스코어 조회 중 오류:", error);
        res.status(500).json({ message: "최종 스코어를 조회하는 중 오류가 발생했습니다." });
    }
});


// 게임 결과 가져오기 API
router.get('/getGameResult/:roomId', async (req, res) => {
    try {
        const scores = await Score.find({ roomname: req.params.roomId });
        if (!scores || scores.length === 0) {
            return res.status(404).json({ success: false, message: 'No results found.' });
        }
        return res.status(200).json({ success: true, scores });
    } catch (error) {
        console.error('Error fetching game results:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});


// 사용자 정보 조회 라우터
router.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // MongoDB에서 사용자 ID로 사용자 정보 조회
        const user = await User.findOne({ id }); // 'id'가 User 모델 필드와 일치해야 함

        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        // 사용자 정보 반환
        res.status(200).json({
            id: user.id,
            username: user.username,
            birthday: user.birthday,
        });
    } catch (error) {
        console.error('사용자 정보 조회 중 오류 발생:', error);
        res.status(500).json({ message: '사용자 정보 조회에 실패했습니다.' });
    }
});


// 플레이어별 기록 조회 라우터
router.get('/player/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // 플레이어 이름이 포함된 게임 기록 찾기
        const scores = await Score.find({
            $or: [{ player1: username }, { player2: username }],
        }).sort({ createdAt: -1 }); // 최신순 정렬

        res.status(200).json(scores);
    } catch (error) {
        console.error("플레이어 기록 조회 중 오류 발생:", error);
        res.status(500).json({ message: '플레이어 기록 조회에 실패했습니다.' });
    }
});



//승률 계산 라우터
router.get('/player/:userId/winrate', async (req, res) => {
    try {
        const { userId:id } = req.params;

        // 1. 플레이어가 포함된 게임 가져오기
        const games = await Score.find({
            $or: [{ player1: id }, { player2: id }],
        });

        console.log(games);
        // 2. 난이도별 데이터를 그룹화
        const difficultyLevels = ["상", "중", "하"];
        const winRates = difficultyLevels.map((level) => {
            // 난이도로 필터링
            const filteredGames = games.filter((game) => game.gamelevel === level);
            const totalGames = filteredGames.length; // 총 게임 수
            const wins = filteredGames.filter((game) => game.winner === id).length; // 승리 수
            const loses = totalGames - wins; // 패배 수
            const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(2) : 0; // 승률

            console.log(wins, loses, winRate);
            return {
                gamelevel: level,
                totalGames,
                wins,
                loses,
                winRate: parseFloat(winRate), // 숫자 형식 유지
            };
        });

        // 3. 결과 반환
        res.status(200).json({
            id,
            winRates,
        });
    } catch (error) {
        console.error("난이도별 승률 계산 중 오류 발생:", error.message);
        res.status(500).json({ message: "난이도별 승률 계산에 실패했습니다." });
    }
});

//난이도별 승률 계산
router.get('/player/:userId/winrate/daily', async (req, res) => {
    try {
        const { userId:id } = req.params;

        // 오늘 기준 최근 7일의 날짜 배열 생성
        const last7Days = Array.from({ length: 7 }, (_, i) =>
            moment().subtract(i, 'days').format('YYYY-MM-DD')
        ).reverse(); // 날짜를 과거 → 현재 순서로 정렬

        // 7일간의 난이도별 승률 계산
        const dailyWinRates = await Promise.all(
            last7Days.map(async (date) => {
                // 날짜의 시작과 끝 시간 범위 설정
                const startOfDay = moment(date).startOf('day').toDate();
                const endOfDay = moment(date).endOf('day').toDate();

                // 해당 날짜에 기록된 게임 필터링
                const games = await Score.find({
                    $or: [{ player1: id }, { player2: id }],
                    createdAt: { $gte: startOfDay, $lte: endOfDay }, // 날짜 범위 필터
                });

                // 난이도별 데이터를 계산
                const levels = ['상', '중', '하'];
                const levelWinRates = levels.map((level) => {
                    const gamesByLevel = games.filter(game => game.gamelevel === level);
                    const totalGames = gamesByLevel.length;
                    const wins = gamesByLevel.filter(game => game.winner === id).length;
                    const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;

                    return {
                        gamelevel: level,
                        totalGames,
                        wins,
                        winRate: winRate.toFixed(2), // 소수점 2자리 고정
                    };
                });

                return {
                    date,
                    levelWinRates, // 난이도별 데이터 추가
                };
            })
        );

        // 클라이언트로 데이터 전달
        res.status(200).json({ id, dailyWinRates });
    } catch (error) {
        console.error("일별 승률 계산 중 오류 발생:", error);
        res.status(500).json({ message: '일별 승률 계산에 실패했습니다.' });
    }
});




module.exports = router;