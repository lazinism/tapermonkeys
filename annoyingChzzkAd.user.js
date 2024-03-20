// ==UserScript==
// @name         Chzzk 광고스킵
// @namespace    http://lazinism.woobi.co.kr/
// @version      2024-03-20-01
// @description  치지직 광고스킵
// @author       귀챠니즘
// @match        https://chzzk.naver.com/live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @grant        none
// ==/UserScript==

(async function() {
    const interval = setInterval(() => {
        const area = document.querySelector('div.skip_area');
        const btn = document.querySelector('button.btn_skip');
        if (area && !area.classList.contains('hide')) {
            btn.click();
            console.log('광고를 스킵했습니다');
        }
    }, 10);
})();
