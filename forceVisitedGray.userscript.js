// ==UserScript==
// @name         Article Link Visited Color - Light Gray
// @namespace    http://lazinism.woobi.com/
// @version      1.0
// @description  네이버 카페 이미본거 회색으로
// @author       Lazinism
// @match        https://cafe.naver.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // CSS 스타일을 추가하여 방문한 링크를 밝은 회색으로 설정
    const style = document.createElement('style');
    style.textContent = `
        a.article:visited {
            color: #b3b3b3 !important;
        }
    `;
    document.head.appendChild(style);
})();
