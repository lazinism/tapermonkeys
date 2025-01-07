// ==UserScript==
// @name         네이버 카페 방문 페이지 회색표시하기 (commentFocus 제외)
// @namespace    http://nokduro.com/
// @version      2025-01-08.2
// @description  네이버 카페 방문 페이지를 clubid와 articleid 기준으로 회색(#ccc)으로 표시하며, 1주일 이후 자동 삭제됩니다. commentFocus=true는 제외합니다.
// @author       귀챠니즘
// @match        https://cafe.naver.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 일주일 (밀리초 단위)
    const STORAGE_KEY = 'visitedArticlesWithTimestamps';

    // URL에서 clubid와 articleid 추출
    function getClubAndArticleIdFromUrl(url) {
        const params = new URL(url).searchParams;
        const clubid = params.get('clubid');
        const articleid = params.get('articleid');
        const commentFocus = params.get('commentFocus');
        if (clubid && articleid && !commentFocus) {
            return `${clubid}_${articleid}`; // clubid와 articleid 조합
        }
        return null;
    }

    // 로컬 스토리지에서 오래된 기록 삭제
    function cleanUpOldRecords() {
        const now = Date.now();
        let visitedArticles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        visitedArticles = visitedArticles.filter(record => now - record.timestamp <= ONE_WEEK_MS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(visitedArticles));
    }

    // 현재 방문한 게시글을 기록에 추가
    function addCurrentArticleToVisited() {
        const now = Date.now();
        const currentKey = getClubAndArticleIdFromUrl(location.href);

        if (currentKey) {
            let visitedArticles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            if (!visitedArticles.some(record => record.key === currentKey)) {
                visitedArticles.push({ key: currentKey, timestamp: now });
                localStorage.setItem(STORAGE_KEY, JSON.stringify(visitedArticles));
            }
        }
    }

    // 방문 기록을 기반으로 링크 스타일 변경
    function updateVisitedLinkStyles() {
        const visitedArticles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const links = document.querySelectorAll('a[href*="articleid="]');

        links.forEach(link => {
            const linkKey = getClubAndArticleIdFromUrl(link.href);
            if (linkKey && visitedArticles.some(record => record.key === linkKey)) {
                link.style.color = '#ccc'; // 회색으로 표시
            }
        });
    }

    // 스크립트 초기화
    function initializeScript() {
        cleanUpOldRecords(); // 오래된 기록 삭제
        addCurrentArticleToVisited(); // 현재 페이지를 방문 기록에 추가
        updateVisitedLinkStyles(); // 방문 기록 기반 스타일 업데이트
    }

    // SPA 방식의 URL 변경 감지 (history API 감지)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        setTimeout(initializeScript, 0); // URL 변경 후 초기화
    };

    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        setTimeout(initializeScript, 0); // URL 변경 후 초기화
    };

    window.addEventListener('popstate', initializeScript); // 뒤로가기/앞으로가기 이벤트 감지

    // 초기 실행
    initializeScript();
})();
