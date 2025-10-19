// ==UserScript==
// @name         Pixiv 悬浮收藏按钮脚本
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在Pixiv作品收藏跳转优化
// @author       LaphiNeko
// @match        https://www.pixiv.net/*
// @grant        none
// ==/UserScript==

'use strict';
var change=0;

// 创建悬浮按钮
var bookmarkButton = document.createElement('button');
// 创建收藏按钮

bookmarkButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
`;
bookmarkButton.style.position = 'fixed';
bookmarkButton.style.right = '30px';
bookmarkButton.style.bottom = '300px'; // 右下角
bookmarkButton.style.width = '50px';
bookmarkButton.style.height = '50px';
bookmarkButton.style.borderRadius = '50%'; // 圆形
bookmarkButton.style.border = 'none';
bookmarkButton.style.outline = 'none';
bookmarkButton.style.backgroundColor = '#007AFF'; // iOS蓝色
bookmarkButton.style.color = '#ffffff';
bookmarkButton.style.fontSize = '24px';
bookmarkButton.style.display = 'flex';
bookmarkButton.style.alignItems = 'center';
bookmarkButton.style.justifyContent = 'center';
bookmarkButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)'; // 添加阴影
bookmarkButton.style.cursor = 'pointer';
bookmarkButton.style.transition = 'background 0.3s ease, box-shadow 0.3s ease';

// 悬停时颜色加深
bookmarkButton.addEventListener('mouseover', () => {
    bookmarkButton.style.backgroundColor = '#005FCC';
    bookmarkButton.style.boxShadow = '0px 6px 10px rgba(0, 0, 0, 0.3)';
});

// 鼠标移开恢复
bookmarkButton.addEventListener('mouseout', () => {
    bookmarkButton.style.backgroundColor = '#007AFF';
    bookmarkButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)';
});

// 添加按钮到页面

bookmarkButton.addEventListener('click', function() {
    var illustID='';
    if (window.location.pathname.includes('novel')) {
        // 获取完整的URL（包括查询参数）
        const url = window.location.href;
        // 使用URLSearchParams来获取id参数
        const params = new URLSearchParams(url.split('?')[1] || '');
        illustID = params.get('id') || '';
        // 如果有#号，去除#后面的部分
        illustID = illustID.split('#')[0];
        window.open('https://www.pixiv.net/novel/bookmark_add.php?id=' + illustID, '_blank');
    } else {
        illustID = window.location.pathname.split('/').pop();
        window.open('https://www.pixiv.net/bookmark_add.php?type=illust&illust_id=' + illustID, '_blank');
    }
});
document.body.appendChild(bookmarkButton);

function runScript() {
    // 检查是否在收藏页面，并在成功提交后关闭当前页面
    if (window.location.href.includes('bookmark_add.php')) {
        var submitButton = document.querySelector('input[type="submit"]._button-large');
        var submitButton2 = document.querySelector('input[type="submit"].remove');
        if (submitButton || submitButton2) {
            submitButton.addEventListener('click', function() {
                // 存储提交状态到 sessionStorage
                sessionStorage.setItem('bookmarkSubmitted', 'true');
                change = 1;
                // 关闭当前页面
                //window.close();
            });
            if (submitButton2) {
                submitButton2.addEventListener('click', function() {
                    // 存储提交状态到 sessionStorage
                    sessionStorage.setItem('bookmarkSubmitted', 'true');
                    change = 1;
                    // 关闭当前页面
                    //window.close();
                });
            }
        }
    }

    // 检查是否在收藏页面跳转后，如果信息已成功提交，则关闭当前页面
    if (sessionStorage.getItem('bookmarkSubmitted') == 'true' && change == 0) {
        // 清除提交状态并关闭页面
        sessionStorage.setItem('bookmarkSubmitted', 'false');
        window.close();
    }

    // 在每个页面添加一个提示，显示 sessionStorage 中是否存在 bookmarkSubmitted
    if (false) {
        var debugDiv = document.createElement('div');
        debugDiv.innerHTML = '当前 sessionStorage 中是否存在 bookmarkSubmitted：' + (sessionStorage.getItem('bookmarkSubmitted') || 'false');
        debugDiv.style.position = 'fixed';
        debugDiv.style.top = '10px';
        debugDiv.style.left = '10px';
        debugDiv.style.backgroundColor = '#fff';
        debugDiv.style.padding = '10px';
        debugDiv.style.border = '1px solid #ccc';
        document.body.appendChild(debugDiv);
    }
}

// 添加 order 判断的跳转功能
function checkAndAddOrder() {
    // 检查并在访问 /artworks 网址时自动增加 ?order=popular_d
    if (window.location.pathname.includes('/artworks') && window.location.pathname.includes('/tags') && !window.location.search.includes('order=popular_d')) {
        window.location.search = '?order=popular_d';
    }
    document.addEventListener('click', function(event) {
    let target = event.target.closest('a'); // 找到最近的 <a> 标签
    if (!target) return;

    let href = target.getAttribute('href');
    if (href && href.includes('/artworks') && href.includes('/tags') && !href.includes('order=popular_d')) {
        event.preventDefault(); // 阻止默认跳转
        window.location.href = href.includes('?') ? href + '&order=popular_d' : href + '?order=popular_d';
    }
});
}


runScript();
checkAndAddOrder();
