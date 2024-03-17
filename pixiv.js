// ==UserScript==
// @name         Pixiv 悬浮收藏按钮脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在Pixiv作品详情页面显示一个悬浮的收藏按钮，并确保信息成功提交后跳转回原作品详情页面
// @author       LaphiNeko
// @match        https://www.pixiv.net/*
// @grant        none
// ==/UserScript==

'use strict';
var change=0;

// 创建悬浮按钮
var bookmarkButton = document.createElement('button');
bookmarkButton.innerHTML = '收藏/取消收藏';
bookmarkButton.style.position = 'fixed';
bookmarkButton.style.right = '20px';
bookmarkButton.style.bottom = '100px';
bookmarkButton.style.transform = 'translateY(-50%)';
bookmarkButton.style.zIndex = '9999';
bookmarkButton.style.backgroundColor = '#0099FF';
bookmarkButton.style.color = '#ffffff';
bookmarkButton.style.fontSize = '16px';
bookmarkButton.style.padding = '10px 20px';
bookmarkButton.style.borderRadius = '5px';
bookmarkButton.addEventListener('click', function() {
    var illustID = window.location.pathname.split('/').pop();
    window.open('https://www.pixiv.net/bookmark_add.php?type=illust&illust_id=' + illustID, '_blank');
});
document.body.appendChild(bookmarkButton);

function runScript() {
    // 检查是否在收藏页面，并在成功提交后关闭当前页面
    if (window.location.href.includes('bookmark_add.php')) {
        var submitButton = document.querySelector('input[type="submit"]._button-large');
        var submitButton2 = document.querySelector('input[type="submit"].remove');
        if (submitButton||submitButton2) {
            submitButton.addEventListener('click', function() {
                // 存储提交状态到 sessionStorage
                sessionStorage.setItem('bookmarkSubmitted', 'true');
                change=1;
                // 关闭当前页面
                //window.close();
            });
            if(submitButton2){
                submitButton2.addEventListener('click', function() {
                    // 存储提交状态到 sessionStorage
                    sessionStorage.setItem('bookmarkSubmitted', 'true');
                    change=1;
                    // 关闭当前页面
                    //window.close();
                });
            }
        }
    }

    // 检查是否在收藏页面跳转后，如果信息已成功提交，则关闭当前页面
    //if (window.location.pathname.includes('/bookmarks/artworks') && sessionStorage.getItem('bookmarkSubmitted') === 'true') {
    if ( sessionStorage.getItem('bookmarkSubmitted') == 'true'&&change==0) {
        // 清除提交状态并关闭页面
        sessionStorage.setItem('bookmarkSubmitted', 'false');
        window.close();
    }
    // 在每个页面添加一个提示，显示 sessionStorage 中是否存在 bookmarkSubmitted
    if(false){
    var debugDiv = document.createElement('div');
    debugDiv.innerHTML = '当前 sessionStorage 中是否存在 bookmarkSubmitted：' + (sessionStorage.getItem('bookmarkSubmitted') || 'false');
    debugDiv.style.position = 'fixed';
    debugDiv.style.top = '10px';
    debugDiv.style.left = '10px';
    debugDiv.style.backgroundColor = '#fff';
    debugDiv.style.padding = '10px';
    debugDiv.style.border = '1px solid #ccc';
    document.body.appendChild(debugDiv);}
}

runScript();
