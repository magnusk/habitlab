// Generated by LiveScript 1.5.0
var LiveScript;
LiveScript = require('./index');
LiveScript.stab = function(code, callback, filename){
  var e;
  try {
    LiveScript.run(code, {
      filename: filename,
      map: 'embedded'
    });
  } catch (e$) {
    e = e$;
  }
  if (typeof callback == 'function') {
    callback(e);
  }
};
LiveScript.load = function(url, callback){
  var xhr;
  xhr = new XMLHttpRequest;
  xhr.open('GET', url, true);
  if ('overrideMimeType' in xhr) {
    xhr.overrideMimeType('text/plain');
  }
  xhr.onreadystatechange = function(){
    var ref$;
    if (xhr.readyState === 4) {
      if ((ref$ = xhr.status) === 200 || ref$ === 0) {
        LiveScript.stab(xhr.responseText, callback, url);
      } else {
        if (typeof callback == 'function') {
          callback(Error(url + ": " + xhr.status + " " + xhr.statusText));
        }
      }
    }
  };
  xhr.send(null);
  return xhr;
};
LiveScript.go = function(){
  var type, sink, i$, ref$, len$, script, that;
  type = /^(?:text\/|application\/)?ls$/i;
  sink = function(error){
    error && setTimeout(function(){
      throw error;
    });
  };
  for (i$ = 0, len$ = (ref$ = document.getElementsByTagName('script')).length; i$ < len$; ++i$) {
    script = ref$[i$];
    if (type.test(script.type)) {
      if (that = script.src) {
        LiveScript.load(that, sink);
      } else {
        LiveScript.stab(script.innerHTML, sink, script.id);
      }
    }
  }
};
module.exports = LiveScript;