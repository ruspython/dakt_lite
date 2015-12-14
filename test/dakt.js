Daktyloskop = window.Daktyloskop || {};
(function (parent, w) {
    "use strict";

    function HttpRequest(options) {
    }

    var xhr;

    if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
    } else{
        xhr = new XMLHttpRequest();
        try{
            xhr.withCredentials = true;
        } catch(e){}
    }

    HttpRequest.send = function (options) {
        var
            data = options.data || "{}",
            url = options.url,
            method = options.method || "GET",
            maxWaiting = options.maxWaiting,
            successFunc = options.success || function() {},
            delayFunc = options.delay || function() {},
            errorFunc = options.error || function() {},
            aborted = false
            ;

        if (method == "GET") {
            xhr.open(method, url, true); //should never happen
        } else {
            xhr.open(method, url, true);
        }
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && !aborted) {
                if (xhr.status == 200 && !aborted) {
                    successFunc(xhr.responseText);
                } else {
                    console.log("Error", xhr.statusText);
                    errorFunc(xhr.statusText);
                }
            }
        };
        if (method == "GET") {
            xhr.send(null);
        } else {
            xhr.send(data);
        }
        maxWaiting && setTimeout(function() {
            if (!xhr.responseText) {
                aborted = true;
                xhr.abort();
                delayFunc();
            }
        }, maxWaiting);

    };

    parent.HttpRequest = HttpRequest;
})(Daktyloskop, window);

Daktyloskop = window.Daktyloskop || {};
(function (parent, w) {
    "use strict";
    function Hashes() {
        return {
            uuid: function () {
                var timestamp, rand, res;
                timestamp = Date.now().toString(16);
                rand = (Math.floor(Math.random() * (Math.pow(2, 34) - 1))).toString(16);
                rand = rand.slice(0, 8);
                rand = Array(9 - rand.length).join("0") + rand;
                res =  rand + timestamp;
                return res;
            },
            x64hash128: function (key, seed) {
                key = key || "";
                seed = seed || 0;
                var remainder = key.length % 16;
                var bytes = key.length - remainder;
                var h1 = [0, seed];
                var h2 = [0, seed];
                var k1 = [0, 0];
                var k2 = [0, 0];
                var c1 = [0x87c37b91, 0x114253d5];
                var c2 = [0x4cf5ad43, 0x2745937f];
                for (var i = 0; i < bytes; i = i + 16) {
                    k1 = [((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24), ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24)];
                    k2 = [((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24), ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24)];
                    k1 = this.x64Multiply(k1, c1);
                    k1 = this.x64Rotl(k1, 31);
                    k1 = this.x64Multiply(k1, c2);
                    h1 = this.x64Xor(h1, k1);
                    h1 = this.x64Rotl(h1, 27);
                    h1 = this.x64Add(h1, h2);
                    h1 = this.x64Add(this.x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
                    k2 = this.x64Multiply(k2, c2);
                    k2 = this.x64Rotl(k2, 33);
                    k2 = this.x64Multiply(k2, c1);
                    h2 = this.x64Xor(h2, k2);
                    h2 = this.x64Rotl(h2, 31);
                    h2 = this.x64Add(h2, h1);
                    h2 = this.x64Add(this.x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
                }
                k1 = [0, 0];
                k2 = [0, 0];
                switch (remainder) {
                    case 15:
                        k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 14)], 48));
                    case 14:
                        k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 13)], 40));
                    case 13:
                        k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 12)], 32));
                    case 12:
                        k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 11)], 24));
                    case 11:
                        k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 10)], 16));
                    case 10:
                        k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 9)], 8));
                    case 9:
                        k2 = this.x64Xor(k2, [0, key.charCodeAt(i + 8)]);
                        k2 = this.x64Multiply(k2, c2);
                        k2 = this.x64Rotl(k2, 33);
                        k2 = this.x64Multiply(k2, c1);
                        h2 = this.x64Xor(h2, k2);
                    case 8:
                        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 7)], 56));
                    case 7:
                        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 6)], 48));
                    case 6:
                        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 5)], 40));
                    case 5:
                        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 4)], 32));
                    case 4:
                        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 3)], 24));
                    case 3:
                        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 2)], 16));
                    case 2:
                        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 1)], 8));
                    case 1:
                        k1 = this.x64Xor(k1, [0, key.charCodeAt(i)]);
                        k1 = this.x64Multiply(k1, c1);
                        k1 = this.x64Rotl(k1, 31);
                        k1 = this.x64Multiply(k1, c2);
                        h1 = this.x64Xor(h1, k1);
                }
                h1 = this.x64Xor(h1, [0, key.length]);
                h2 = this.x64Xor(h2, [0, key.length]);
                h1 = this.x64Add(h1, h2);
                h2 = this.x64Add(h2, h1);
                h1 = this.x64Fmix(h1);
                h2 = this.x64Fmix(h2);
                h1 = this.x64Add(h1, h2);
                h2 = this.x64Add(h2, h1);
                return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
            },
            /// MurmurHash3 related functions

            //
            // Given two 64bit ints (as an array of two 32bit ints) returns the two
            // added together as a 64bit int (as an array of two 32bit ints).
            //
            x64Add: function (m, n) {
                m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
                n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
                var o = [0, 0, 0, 0];
                o[3] += m[3] + n[3];
                o[2] += o[3] >>> 16;
                o[3] &= 0xffff;
                o[2] += m[2] + n[2];
                o[1] += o[2] >>> 16;
                o[2] &= 0xffff;
                o[1] += m[1] + n[1];
                o[0] += o[1] >>> 16;
                o[1] &= 0xffff;
                o[0] += m[0] + n[0];
                o[0] &= 0xffff;
                return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
            }
            ,

            //
            // Given two 64bit ints (as an array of two 32bit ints) returns the two
            // multiplied together as a 64bit int (as an array of two 32bit ints).
            //
            x64Multiply: function (m, n) {
                m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
                n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
                var o = [0, 0, 0, 0];
                o[3] += m[3] * n[3];
                o[2] += o[3] >>> 16;
                o[3] &= 0xffff;
                o[2] += m[2] * n[3];
                o[1] += o[2] >>> 16;
                o[2] &= 0xffff;
                o[2] += m[3] * n[2];
                o[1] += o[2] >>> 16;
                o[2] &= 0xffff;
                o[1] += m[1] * n[3];
                o[0] += o[1] >>> 16;
                o[1] &= 0xffff;
                o[1] += m[2] * n[2];
                o[0] += o[1] >>> 16;
                o[1] &= 0xffff;
                o[1] += m[3] * n[1];
                o[0] += o[1] >>> 16;
                o[1] &= 0xffff;
                o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0]);
                o[0] &= 0xffff;
                return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
            }
            ,
            //
            // Given a 64bit int (as an array of two 32bit ints) and an int
            // representing a number of bit positions, returns the 64bit int (as an
            // array of two 32bit ints) rotated left by that number of positions.
            //
            x64Rotl: function (m, n) {
                n %= 64;
                if (n === 32) {
                    return [m[1], m[0]];
                }
                else if (n < 32) {
                    return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))];
                }
                else {
                    n -= 32;
                    return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))];
                }
            }
            ,
            //
            // Given a 64bit int (as an array of two 32bit ints) and an int
            // representing a number of bit positions, returns the 64bit int (as an
            // array of two 32bit ints) shifted left by that number of positions.
            //
            x64LeftShift: function (m, n) {
                n %= 64;
                if (n === 0) {
                    return m;
                }
                else if (n < 32) {
                    return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
                }
                else {
                    return [m[1] << (n - 32), 0];
                }
            }
            ,
            //
            // Given two 64bit ints (as an array of two 32bit ints) returns the two
            // xored together as a 64bit int (as an array of two 32bit ints).
            //
            x64Xor: function (m, n) {
                return [m[0] ^ n[0], m[1] ^ n[1]];
            }
            ,
            //
            // Given a block, returns murmurHash3's final x64 mix of that block.
            // (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
            // only place where we need to right shift 64bit ints.)
            //
            x64Fmix: function (h) {
                h = this.x64Xor(h, [0, h[0] >>> 1]);
                h = this.x64Multiply(h, [0xff51afd7, 0xed558ccd]);
                h = this.x64Xor(h, [0, h[0] >>> 1]);
                h = this.x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
                h = this.x64Xor(h, [0, h[0] >>> 1]);
                return h;
            }
        };
    }

    parent.Hashes = Hashes();
})(Daktyloskop, window);

// http://www.quirksmode.org/js/cookies.html#script

(function (parent, w) {
    "use strict";
    function Cookies() {
        return {
            "set": function (name, value, days) {
                var expires;
                if (days) {
                    var date = new Date();
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    expires = "; expires=" + date.toGMTString();
                }
                else expires = "";
                document.cookie = name + "=" + value + expires + "; path=/";
            },
            "get": function (name) {
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
                }
                return null;
            },
            "delete": function (name) {
                this.set(name, "", -1);
            }
        }
    }

    parent.Cookies = Cookies();
})(Daktyloskop, window);

(function (parent, w) {
    "use strict";
    parent.mergeObjects = function(objTo, objFrom) {
        for (var key in objFrom) {
            if (!objTo[key]) {
                objTo[key] = objFrom[key];
            }
        }
    }
})(Daktyloskop, window);


Daktyloskop = window.Daktyloskop || {};
Daktyloskop.module = window.Daktyloskop.module || {};

(function (parent, w) {
    "use strict";

    var indexedDB = w.indexedDB || w.mozIndexedDB || w.webkitIndexedDB || w.msIndexedDB,
        apiEndpoint,
        logElem,
        logging = false,
        caching = false,
        client_info = {
            hostname: w.location.hostname,
            pathname: w.location.pathname,
            port: w.location.port,
            protocol: w.location.protocol,
            hash: w.location.hash,
            href: w.location.href,
            ua: navigator.userAgent,
            languages: navigator.language,
            product: navigator.product,
            productSub: navigator.productSub,
            platform: navigator.platform,
            vendor: navigator.vendor,
            vendorSub: navigator.vendorSub,
            appCodeName: navigator.appCodeName,
            appName: navigator.appName,
            cookieEnabled: navigator.cookieEnabled.toString(),
            doNotTrack: navigator.doNotTrack,
            hardwareConcurrency: navigator.hardwareConcurrency
        },
        moduleSequence
        ;

    function init() {
        //Compiling variables:
        parent.logging      =true;
        parent.logElem      =null;
        parent.caching      =true;
        parent.apiEndpoint  ="http://tda.lvh.me:3000/test/target.json";
        parent.modules      =null;
        parent.afterLoad      =null;

        parent.dataToSend = {
            client: client_info,
            generated: {},
            stored_generated: {},
            err: [],
            gcached: false
        };

        parent.commonData = {
            stored: {}
        };

        parent.storageName = "minidmp2";
        parent.modifiedStorages = [];
        parent.dataresponse = "";

        // Reset functions for different kinds of storage (commonData['stored']).
        // Add them to be able to updated storage from another module.
        parent.storageResets = {};

        logging = parent.logging || false;
        caching = parent.caching || false;
        apiEndpoint = parent.apiEndpoint;
        logElem = parent.logElem || document.getElementsByTagName('body')[0];

        if (!apiEndpoint) {
            throw "API endpoint must be set";
        }
        run();
    }

    function run() {
        var stored;
        try {
            stored = JSON.parse(w.localStorage.getItem(parent.storageName + '-stored'));
        } catch (err) {
            stored = null;
        }

        if (caching && stored) {
            parent.commonData['stored'] = stored;
            parent.dataToSend['gcached'] = true;
        }

        parent.sessionUUID = parent.Hashes.uuid();
        prepareDataToSend();
    }

    //TODO: add public methods for adding data
    function prepareDataToSend(seq) {
        try {
            w.localStorage.setItem(parent.storageName + '-stored', JSON.stringify(parent.commonData['stored'] ));
        } catch (err) {
        }

        sendData(JSON.stringify(parent.dataToSend), seq);
    }

    function sendData(data) {
        var onRequestSuccess = function (res) {

                parent.dataresponse = res;
                parent.log('Request success', {success: true});

            },
            onRequestDelay = function () {
                parent.log('Request delayed');
            },
            onRequestError = function (err) {
                parent.log('Request error', err);
            }
            ;

        parent.HttpRequest.send({
            url: apiEndpoint,
            data: data,
            method: "POST",
            //maxWaiting: 250,
            success: onRequestSuccess,
            delay: onRequestDelay,
            error: onRequestError
        });
    }

    parent.log = function (argName, arg) {
        if (logging) {
            if (arg) {
                console.log(argName, ': ', arg);
            } else {
                console.log(argName);
            }
        }
    };

    parent.VERSION = "0.0.1";
    parent.init = init;

})(Daktyloskop, window);
Daktyloskop = window.Daktyloskop || {};
Daktyloskop.module = window.Daktyloskop.module || {};

(function (parent, w) {
    "use strict";

    var indexedDB = w.indexedDB || w.mozIndexedDB || w.webkitIndexedDB || w.msIndexedDB,
        apiEndpoint,
        logElem,
        logging = false,
        caching = false,
        client_info = {
            hostname: w.location.hostname,
            pathname: w.location.pathname,
            port: w.location.port,
            protocol: w.location.protocol,
            hash: w.location.hash,
            href: w.location.href,
            ua: navigator.userAgent,
            languages: navigator.language,
            product: navigator.product,
            productSub: navigator.productSub,
            platform: navigator.platform,
            vendor: navigator.vendor,
            vendorSub: navigator.vendorSub,
            appCodeName: navigator.appCodeName,
            appName: navigator.appName,
            cookieEnabled: navigator.cookieEnabled.toString(),
            doNotTrack: navigator.doNotTrack,
            hardwareConcurrency: navigator.hardwareConcurrency
        },
        moduleSequence
        ;

    function init() {
        //Compiling variables:
        parent.logging      =true;
        parent.logElem      =null;
        parent.caching      =true;
        parent.apiEndpoint  ="http://tda.lvh.me:3000/test/target.json";
        parent.modules      =null;
        parent.afterLoad      =null;

        parent.dataToSend = {
            client: client_info,
            generated: {},
            stored_generated: {},
            err: [],
            gcached: false
        };

        parent.commonData = {
            stored: {}
        };

        parent.storageName = "minidmp2";
        parent.modifiedStorages = [];
        parent.dataresponse = "";

        // Reset functions for different kinds of storage (commonData['stored']).
        // Add them to be able to updated storage from another module.
        parent.storageResets = {};

        logging = parent.logging || false;
        caching = parent.caching || false;
        apiEndpoint = parent.apiEndpoint;
        logElem = parent.logElem || document.getElementsByTagName('body')[0];

        if (!apiEndpoint) {
            throw "API endpoint must be set";
        }
        run();
    }

    function run() {
        var stored;
        try {
            stored = JSON.parse(w.localStorage.getItem(parent.storageName + '-stored'));
        } catch (err) {
            stored = null;
        }

        if (caching && stored) {
            parent.commonData['stored'] = stored;
            parent.dataToSend['gcached'] = true;
        }

        parent.sessionUUID = parent.Hashes.uuid();
        prepareDataToSend();
    }

    //TODO: add public methods for adding data
    function prepareDataToSend(seq) {
        try {
            w.localStorage.setItem(parent.storageName + '-stored', JSON.stringify(parent.commonData['stored'] ));
        } catch (err) {
        }

        sendData(JSON.stringify(parent.dataToSend), seq);
    }

    function sendData(data) {
        var onRequestSuccess = function (res) {

                parent.dataresponse = res;
                parent.log('Request success', {success: true});

            },
            onRequestDelay = function () {
                parent.log('Request delayed');
            },
            onRequestError = function (err) {
                parent.log('Request error', err);
            }
            ;

        parent.HttpRequest.send({
            url: apiEndpoint,
            data: data,
            method: "POST",
            //maxWaiting: 250,
            success: onRequestSuccess,
            delay: onRequestDelay,
            error: onRequestError
        });
    }

    parent.log = function (argName, arg) {
        if (logging) {
            if (arg) {
                console.log(argName, ': ', arg);
            } else {
                console.log(argName);
            }
        }
    };

    parent.VERSION = "0.0.1";
    parent.init = init;

})(Daktyloskop, window);

Daktyloskop.init();