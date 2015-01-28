/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this file,
* You can obtain one at http://mozilla.org/MPL/2.0/. */

let {interfaces: Ci, utils: Cu, classes: Cc} = Components;
Cu.import("resource:///modules/imServices.jsm");
let debug = true;
let addon = {
  _quran: new Array(),
  kQuranCommand: 'gitio',
  LOG: function(aMsg) {
    if (debug)
      Services.console.logStringMessage(aMsg);
  },  
  ERROR: function(aMsg) {
    Cu.reportError(aMsg)
  },
  xhr: function(url, cb, params) {
    let xhr = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Ci.nsIXMLHttpRequest);
    let handler = ev => {
      evf(m => xhr.removeEventListener(m, handler, !1));
      switch (ev.type) {
          case 'load':
              if (xhr.status == 200) {
                  cb(xhr.response);
                  break;
              }
          default:
              this.ERROR('XHR Error\nError Fetching Package: ' + xhr.statusText + ' [' + ev.type + ':' + xhr.status + ']');
              break;
      }
    };
    let evf = f => ['load', 'error', 'abort'].forEach(f);
    evf(m => xhr.addEventListener(m, handler, false));
    xhr.mozBackgroundRequest = true;
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Content-length", params.length); 
    xhr.send(params);
  },
  init: function() {
    Services.cmd.registerCommand({
      name: this.kQuranCommand,
      get helpString() "Do you have a GitHub URL you'd like to shorten? Use Git.io!",
      usageContext: Ci.imICommand.CMD_CONTEXT_ALL,
      priority: Ci.imICommand.CMD_PRIORITY_HIGH,
      run: (function(aMsg, aConv) {
        let conv = aConv.wrappedJSObject;
          this.xhr("http://git.io/create", data => {
            conv.sendMsg("http://git.io/" + data);
          }, "url="+encodeURI(aMsg));
        
        return true;
      }).bind(this)
    });
  }
}

function startup(aData, aReason) {
  let mObserver = {
    observe: function(subject, topic, data) {
      window = Services.wm.getMostRecentWindow("Messenger:convs");
      if (!window) {
        return;
      }
      addon.init();
      Services.obs.removeObserver(this, "toplevel-window-ready");
      Services.obs.removeObserver(this, "xul-window-visible", false);
    }
  }
  window = Services.wm.getMostRecentWindow("Messenger:convs");
  if (!window) {
    Services.obs.addObserver(mObserver, "toplevel-window-ready", false);
    Services.obs.addObserver(mObserver, "xul-window-visible", false);
  }
  else
    addon.init();
}

function shutdown(aData, aReason) {
  try {
    Services.cmd.unregisterCommand(addon.kQuranCommand);
  } catch (e) {
    addon.ERROR(e);
  }
}

function install(aData, aReason) {}

function uninstall(aData, aReason) {
  delete addon;
}