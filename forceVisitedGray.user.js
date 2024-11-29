// ==UserScript==
// @name         네이버 카페 방문 페이지 회색표시하기
// @namespace    http://nokduro.com/
// @version      2024-11-29-00
// @description  '이미 방문한 페이지'를 회색(#ccc)으로 표시합니다. 해당 색상은 '트게더'에 사용되었던 방문 페이지 색상과 동일합니다.
// @author       귀챠니즘
// @match        https://cafe.naver.com/MyCafeIntro.nhn*
// @match        https://cafe.naver.com/ArticleList.nhn*
// @match        https://cafe.naver.com/ca-fe/cafes/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @run-at       document-start
// @grant        none
// ==/UserScript==
document.head.innerHTML+=`<style>a.article:visited,a.tit:visited,a.m-tcol-c:visited{color:#ccc !important;}</style>`;
