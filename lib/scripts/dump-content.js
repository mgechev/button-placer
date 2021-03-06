/**
 * This scripts just dumps the content of a web page on the standard output.
 * You should run this script through PhantomJS.
 *
 * It's dumb and silent, but kinda-sorta-okay for a prototype.
 */

var page = require('webpage').create(),
    CONFIG = require('../config'),
    system = require('system'),
    url,
    content;

function includeSDK(doc, CONFIG) {
  var dependencies = CONFIG.DEPENDENCIES,
      sibling = doc.documentElement.childNodes[0],
      script;
  dependencies.forEach(function (dependency) {
    script = doc.createElement('script');
    script.src = dependency;
    sibling.parentNode.insertBefore(script, sibling);
  });
}

function relativeToAbsolute(url){
    /* Only accept commonly trusted protocols:
     * Only data-image URLs are accepted, Exotic flavours (escaped slash,
     * html-entitied characters) are not supported to keep the function fast */
  if(/^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i.test(url))
         return url; //Url is already absolute

    var base_url = PAGE_URL;
    if(url.substring(0,2) == "//")
        return location.protocol + url;
    else if(url.charAt(0) == "/")
        return PAGE_URL + url;
    else if(url.substring(0,2) == "./")
        url = "." + url;
    else if(/^\s*$/.test(url))
        return ""; //Empty = Return nothing
    else url = "../" + url;

    url = base_url + url;
    var i=0
    while(/\/\.\.\//.test(url = url.replace(/[^\/]+\/+\.\.\//g,"")));

    /* Escape certain characters to prevent XSS */
    url = url.replace(/\.$/,"").replace(/\/\./g,"").replace(/"/g,"%22")
            .replace(/'/g,"%27").replace(/</g,"%3C").replace(/>/g,"%3E");
    return url;
}

function fixUrls(doc) {

  function toArray(nodes) {
    if (!nodes) return [];
    if (!nodes.length) {
      return [nodes];
    } else {
      return Array.prototype.slice.call(nodes);
    }
  }

  window.onload = function () {
    var a = toArray(doc.querySelector('a')),
        link = toArray(doc.querySelector('link')),
        img = toArray(doc.querySelector('img')),
        script = toArray(doc.querySelector('script'));

    a.concat(link).concat(script).concat(img).forEach(function (el) {
      if (el.src) {
        el.src = relativeToAbsolute(el.src);
      } else if (el.href) {
        el.href = relativeToAbsolute(e.href);
      }
    });
  };
}

if (url = system.args[1]) {
  page.open(url, function(status) {
    if (status === 'success') {
      //TODO: add these methods to a single global object
      content = page.evaluate(function(includeSDK, relativeToAbsolute, CONFIG) {
        includeSDK(document, CONFIG);
        return document.documentElement.outerHTML;
      }, includeSDK, relativeToAbsolute, CONFIG);

      console.log(content);

      phantom.exit();
    }
  });
}
