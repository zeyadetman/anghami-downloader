// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var tabId = parseInt(window.location.search.substring(1));

window.addEventListener("load", function() {
  chrome.debugger.sendCommand({tabId:tabId}, "Network.enable");
  chrome.debugger.onEvent.addListener(onEvent);
});

window.addEventListener("unload", function() {
  chrome.debugger.detach({tabId:tabId});
});

var requests = {};

function onEvent(debuggeeId, message, params) {
  if (tabId != debuggeeId.tabId)
  return;
  
  if (message == "Network.requestWillBeSent") {
    var requestDiv = requests[params.requestId];
    if (!requestDiv) {
      requests[params.requestId] = requestDiv;
      if(params.request.url.includes('anghamiaudio.akamaized.net/mp43')) {
        console.log(params.request.url)
        var title = '';
        chrome.tabs.get(tabId, ({title}) => 
          document.getElementById("container").innerHTML += 
            `<a href="${params.request.url}" download>Download ${title}</a> </br>`
        );
      }
    }
  }
}