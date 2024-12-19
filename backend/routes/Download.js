const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

router.get('/pdf', async (req, res) => {
    const url = req.query.url || 'https://team08.kwweb.duckdns.org/mypage'; // 기본 URL
    const screenshotPath = path.join(__dirname, 'debug-screenshot.png'); // 저장될 파일 경로

    try {
        console.log(`스크린샷 생성 시도 중: ${url}`);

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        // 디스크에 스크린샷 저장
        await page.screenshot({
            path: screenshotPath, // 파일 저장 경로
            fullPage: true,
        });

        await browser.close();

        console.log('스크린샷 생성 및 저장 완료:', screenshotPath);

        // 브라우저로 스크린샷 파일 전송
        res.download(screenshotPath, 'screenshot.png', (err) => {
            if (err) {
                console.error('파일 다운로드 중 오류:', err);
                res.status(500).send('파일 다운로드 오류 발생');
            }

            // 다운로드 완료 후 파일 삭제 (선택 사항)
            fs.unlink(screenshotPath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('파일 삭제 중 오류:', unlinkErr);
                } else {
                    console.log('임시 파일 삭제 완료:', screenshotPath);
                }
            });
        });

    } catch (error) {
        console.error('스크린샷 생성 오류:', error);
        res.status(500).send('스크린샷 생성 오류 발생');
    }
});

module.exports = router;
