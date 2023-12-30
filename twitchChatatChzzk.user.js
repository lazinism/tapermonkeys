// ==UserScript==
// @name         치지직-트위치 채팅연동
// @namespace    http://nokduro.com/
// @version      2023-12-30-02
// @description  트위치 채팅을 치지직에서도!
// @author       귀챠니즘
// @match        https://chzzk.naver.com/live/*?twitch=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @grant        none
// ==/UserScript==

function launchWS(){
    let params = new URLSearchParams(window.location.search);
    let channelId = params.get('twitch');
    let ws = new WebSocket('wss://irc-ws.chat.twitch.tv/');
    ws.addEventListener('open', ()=>{
        console.log('Twitch WS opened to:'+channelId);
        ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');ws.send('PASS SCHMOOPIIE');ws.send('NICK justinfan'+Math.floor(10000 + Math.random() * 90000));ws.send('JOIN #'+channelId);
    });
    ws.addEventListener('message', (e)=>{
        let message = e.data.trim();
        if(message.startsWith("PING")) ws.send('PONG');
        else if(message.startsWith("PONG")) ws.send('PING');
        else if(!message.startsWith(':tmi.twitch.tv') && message.startsWith("@badge-info=")){
            let a = message.split(';display-name=');
            let b = message.match(/emotes=([^;]+)/);
            let nick = a[1].split(';')[0];
            let cr = getColorFromNick(nick);
            let usermessage = a[1].split('PRIVMSG #'+channelId+' :')[1];
            let extra = b?b[1]:null
            appendMessage({nick: nick, color: cr, message: usermessage, extra: extra});
        }
    });
    ws.addEventListener('close', ()=>{
        setTimeout(launchWS, 2e3);
    });
    return ws;
}

const imageStyle = 'height:24px;margin:-2px 0 -2px 1px; width:24px;';
const wrapperStyle = 'color: #dfe2ea;line-height: 20px;padding: 4px 8px 4px 6px;text-align:left;overflow-wrap:anywhere;word-break:break-all;';
const containerStyle = 'color: #fff;font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", Helvetica, Arial, NanumGothic, 나눔고딕, "Malgun Gothic", "맑은 고딕", Dotum, 굴림, gulim, 새굴림, "noto sans", 돋움, sans-serif;font-size: 14px;text-rendering: auto; color: buttontext; letter-spacing: normal;word-spacing: normal;line-height: normal;text-transform: none;text-indent: 0px;text-shadow: none;text-align: center;cursor: default;';
const usernameContainerStyle = 'line-height: 18px;margin: -2px 0;padding: 2px 4px 2px 2px;position: relative;display: inline-block;line-break: anywhere;font-weight: 500;'

function hash(str) {
    // https://www.grepper.com/answers/353455/javascript+simple+hash?ucard=1
    var h = 0;
    if (str.length == 0) {
        return h;
    }
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        h = ((h<<5)-h)+char;
        h = h & h; // Convert to 32bit integer
    }
    return h;
}

function getColorFromNick(nick) {
    let h = Math.abs(hash("hashhash"+nick));
    let b = h%64;
    h = Math.floor(h/64);
    let g = h%64;
    h = Math.floor(h/64);
    let r = h%64;
    let col = `rgb(${r + 96}, ${g + 32}, ${b + 160})`;
    return col;
}

function removeElementsOverLimit(parentElement, query) {
    let childrenToRemove = document.querySelectorAll(query);
    let count = document.querySelectorAll(query).length;
    for (let i = 0; i < childrenToRemove.length; i++) {
        if (count<=200) break;
        if (childrenToRemove[i].parentElement === parentElement) {
            parentElement.removeChild(childrenToRemove[i]);
            count--;
        }
    }
}

function appendMessage(messageDict){
    // 수정: RlaChi
    let message = messageDict.message;
    let chatboxdiv = document.querySelector('aside');
    chatboxdiv = chatboxdiv.children[chatboxdiv.childElementCount - 2].children[0];
    let list_item = document.createElement('div');
    let message_container = document.createElement('div');
    let message_wrapper = document.createElement('div');
    let username_container_span = document.createElement('span');
    let user_badge_span = document.createElement('img');
    let username_span = document.createElement('span');
    let message_span = document.createElement('span');
    if(messageDict.extra){
        let a = messageDict.extra.split('/'), b={};
        a.forEach(c=>{
            let [d,e]=c.split(':');
            d=`https://static-cdn.jtvnw.net/emoticons/v2/${d}/default/dark/1.0`;
            e.split(',').forEach(f=>{
                let [g,h]=f.split('-'), i = message.substring(parseInt(g),parseInt(h)+1);
                b[i]||(b[i]=`<img src="${d}" alt="${i}" style="${imageStyle}" />`);
            });
        });
        Object.keys(b).forEach(c=>{
            let d=RegExp(c,"g");
            message = message.replace(d,b[c]);
        });
    }
    message_span.innerHTML = message;
    username_container_span.style.cssText = usernameContainerStyle;
    user_badge_span.src = 'https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png'
    user_badge_span.style.cssText = 'width: 18px; height: 18px; margin-right: 5px;'
    username_span.innerText = messageDict.nick;
    username_span.style.cssText = `color: ${messageDict.color}`;
    username_container_span.appendChild(user_badge_span);
    username_container_span.appendChild(username_span);
    message_wrapper.style.cssText = wrapperStyle;
    message_wrapper.appendChild(username_container_span);message_wrapper.appendChild(message_span);
    message_container.style.cssText = containerStyle;
    message_container.appendChild(message_wrapper);
    list_item.appendChild(message_container);
    list_item.classList.add('twitchChat');
    let lastChild = chatboxdiv.lastElementChild;
    chatboxdiv.insertBefore(list_item, lastChild);
    removeElementsOverLimit(chatboxdiv, '.twitchChat');
}

(async function() {
    'use strict';
    const interval = setInterval(() => {
        if (document.querySelector('aside')){
            clearInterval(interval);
            let params = new URLSearchParams(window.location.search);
            if(params.get('twitch')){
                launchWS()
            }
        }
    }, 100)
})();
