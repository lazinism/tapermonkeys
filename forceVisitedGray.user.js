// ==UserScript==
// @name         네이버 카페 방문 페이지 회색표시하기 (일주일 기록 유지)
// @namespace    http://nokduro.com/
// @version      2025-01-06.2
// @description  '이미 방문한 페이지'를 articleid 기준으로 회색(#ccc)으로 표시하며, 일주일이 지난 기록은 삭제합니다.
// @author       귀챠니즘
// @match        https://cafe.naver.com/MyCafeIntro.nhn*
// @match        https://cafe.naver.com/ArticleList.nhn*
// @match        https://cafe.naver.com/ca-fe/cafes/*
// @match        https://cafe.naver.com/ArticleRead.nhn*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 일주일 (밀리초 단위)
    const STORAGE_KEY = 'visitedArticlesWithTimestamps';

    // URL에서 articleid 추출 함수
    function getArticleIdFromUrl(url) {
        const params = new URL(url).searchParams;
        return params.get('articleid');
    }

    // 현재 시간 (밀리초)
    const now = Date.now();

    // 로컬 스토리지에서 방문 기록 불러오기
    let visitedArticles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    // 오래된 기록 삭제
    visitedArticles = visitedArticles.filter(record => {
        return now - record.timestamp <= ONE_WEEK_MS; // 일주일 이내의 기록만 유지
    });

    // 현재 URL의 articleid 가져오기
    const currentArticleId = getArticleIdFromUrl(window.location.href);

    if (currentArticleId) {
        // 방문 기록에 현재 articleid 추가 (중복 방지)
        if (!visitedArticles.some(record => record.articleid === currentArticleId)) {
            visitedArticles.push({ articleid: currentArticleId, timestamp: now });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(visitedArticles));
        }
    }

    // 모든 링크에서 articleid를 기준으로 방문 여부 확인 후 스타일 적용
    const links = document.querySelectorAll('a[href*="articleid="]');
    links.forEach(link => {
        const linkArticleId = getArticleIdFromUrl(link.href);
        if (visitedArticles.some(record => record.articleid === linkArticleId)) {
            link.style.color = '#ccc'; // 회색 적용
        }
    });

    // 로컬 스토리지 업데이트 (오래된 기록 삭제 적용)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitedArticles));
})();
