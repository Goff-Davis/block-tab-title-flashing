// ==UserScript==
// @name         Prevent Title Change
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prevent websites from changing their tab titles
// @author       Goff-Davis
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    const whitelist = JSON.parse(GM_getValue('whitelist', '[]'));

    function saveWhitelist() {
        GM_setValue('whitelist', JSON.stringify(whitelist));
    }

    function addToWhitelist() {
        const domain = prompt('Enter the domain to whitelist (e.g., example.com):');
        if (domain && !whitelist.includes(domain)) {
            whitelist.push(domain);
            saveWhitelist();
        }
    }

    function removeFromWhitelist() {
        const domain = prompt('Enter the domain to remove from the whitelist (e.g., example.com):');
        const index = whitelist.indexOf(domain);
        if (index !== -1) {
            whitelist.splice(index, 1);
            saveWhitelist();
        }
    }

    GM_registerMenuCommand('Add to Whitelist', addToWhitelist);
    GM_registerMenuCommand('Remove from Whitelist', removeFromWhitelist);

    const currentDomain = location.host;

    if (whitelist.includes(currentDomain)) return;

    const originalTitle = document.title;
    const observer = new MutationObserver(() => {
        if (document.title !== originalTitle) {
            document.title = originalTitle;
        }
    });

    observer.observe(document.querySelector('title'), { childList: true });
})();
