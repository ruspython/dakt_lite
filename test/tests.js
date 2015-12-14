casper.test.begin('Testing Daktyloskop', function (test) {
    casper.test.assertRaises(function(throwIt) {

    }, [true], 'Error initializing.');

    casper.options.onResourceRequested = function(C, requestData, request) {
        this.echo(C);
        this.echo(requestData);
        this.echo(request);
    };
    casper.options.onResourceReceived = function(C, response) {
        this.echo(C);
        this.echo(response);
    };
    test.done();

});
