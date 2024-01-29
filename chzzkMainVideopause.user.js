// ==UserScript==
// @name         치지직 메인화면 영상 일시정지
// @namespace    https://lazinism.github.io/
// @version      2024-01-29
// @description  치지직 메인화면 영상을 항상 일시정지
// @author       귀챠니즘
// @match        https://chzzk.naver.com/$
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const interval = setInterval(() => {
        const internalvideo = document.querySelector('div#layout-body>div>section>div>div>div>div>div.webplayer-internal-core-shadow.wpc-full.wpc-pos-rel>div.webplayer-internal-core-source-container.wpc-full>div.webplayer-internal-source-shadow>div.webplayer-internal-source-wrapper>video.webplayer-internal-video');
        if(internalvideo){
            internalvideo.pause();
        }
    }, 100);
})();
