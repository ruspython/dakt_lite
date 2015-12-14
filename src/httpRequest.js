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
