// ==UserScript==
// @name         Chzzk 중간광고 차단
// @namespace    http://lazinism.woobi.co.kr/
// @version      2024-06-16-01
// @description  치지직 중간광고 차단
// @author       귀챠니즘
// @match        https://chzzk.naver.com/live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @grant        GM_webRequest
// @webRequest   {"selector":"https://api.chzzk.naver.com/ad-polling/v1/lives/*/ad*","action":"cancel"}
// ==/UserScript==

(function() {
    'use strict';
    GM_webRequest([
        { selector: "https://api.chzzk.naver.com/ad-polling/v1/lives/*/ad?ts=*", action: 'cancel' },
    ], (info, message, details) => {
       console.log('중간광고 차단 시도.', info, message, details);
    });
})();
