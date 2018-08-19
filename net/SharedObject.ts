
export class SharedObject
{
    public static setItem(key:string, value:string):boolean
    {
        if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) { return false; }
        var vEnd = null;
        var sDomain = null;
        var sPath = null;
        var bSecure = null;
        var sExpires = "";
        if (vEnd) {
          switch (vEnd.constructor) {
            case Number:
              sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
              /*
              Note: Despite officially defined in RFC 6265, the use of `max-age` is not compatible with any
              version of Internet Explorer, Edge and some mobile browsers. Therefore passing a number to
              the end parameter might not work as expected. A possible solution might be to convert the the
              relative time to an absolute time. For instance, replacing the previous line with:
              */
              /*
              sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; expires=" + (new Date(vEnd * 1e3 + Date.now())).toUTCString();
              */
              break;
            case String:
              sExpires = "; expires=" + vEnd;
              break;
            case Date:
              sExpires = "; expires=" + vEnd.toUTCString();
              break;
          }
        }
        document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    }

    public static getItem(value:string):any
    {
        if (!value) { return null; }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(value).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    }

    public static removeItem(key:string):boolean
    {
        if (!SharedObject.hasItem(key)) { return false; }
        var sDomain = null;
        var sPath = null;
        document.cookie = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    }

    public static hasItem(key:string):boolean
    {
        if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) { return false; }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    }

    public static getKeys():string[]
    {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
    }

    public static getLocal(name:string):SharedObject
    {
        return new SharedObject();
    }

    public get data():Object
    {
        return {};
    }
}

var docCookies = {
    keys: function () {
      
    }
  };