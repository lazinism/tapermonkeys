// ==UserScript==
// @name         Chzzk 일시정지시 플레이버튼
// @namespace    http://nokduro.com/
// @version      2024-01-19-03
// @description  일시정지 시 화면을 눌러 재생
// @author       귀챠니즘
// @match        https://chzzk.naver.com/live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @grant        none
// ==/UserScript==

function applyStyles(element, styles) {
  Object.assign(element.style, styles);
}

(async function() {
    const interval = setInterval(() => {
        if (document.getElementById('live_player_layout')){
            clearInterval(interval);
            let buttonoverlay = document.createElement('div');
            let button = document.createElement('button');
            buttonoverlay.innerText = '▶️';
            buttonoverlay.appendChild(button)
            let buttonoverlayStyle = {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                visibility: 'hidden',
                cursor: 'pointer',
                fontSize: '5vw',
                color: 'white'
            }
            applyStyles(buttonoverlay, buttonoverlayStyle);
            let video = document.querySelector('.webplayer-internal-video');
            let videoContainer = document.getElementById('live_player_layout');
            videoContainer.appendChild(buttonoverlay);
            video.addEventListener('pause', function(){
                buttonoverlay.style.visibility = 'visible';
            });
            video.addEventListener('play', function(){
                buttonoverlay.style.visibility = 'hidden';
            });
            buttonoverlay.addEventListener('click', function(){
                document.querySelector('button.pzp-button.pzp-pc-playback-switch.pzp-pc__playback-switch.pzp-pc-ui-button.pzp-pc-ui-button--clicked').click();
            });
        }
    }, 100)
})();
