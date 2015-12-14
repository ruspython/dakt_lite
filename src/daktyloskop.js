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
        parent.logging      /*==Daktyloskop.logging==*/;
        parent.logElem      /*==Daktyloskop.logElem==*/;
        parent.caching      /*==Daktyloskop.caching==*/;
        parent.apiEndpoint  /*==Daktyloskop.apiEndpoint==*/;
        parent.modules      /*==Daktyloskop.modules==*/;
        parent.afterLoad      /*==Daktyloskop.afterLoad==*/;

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
        moduleSequence = new parent.Sequence();

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
