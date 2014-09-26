(function () {

    'use strict';

    var config = {
        media: {
            align: {
                vertical: {
                    x: 'center',
                    y: 50
                },
                horizontal: {
                    x: 'center',
                    y: 100
                }
            },
            src: '/base/media/image/',
            ratios: [1, 2, 3, 4, 5, 6]
        },
        resources: {
            css: {
                base: '/static/css/',
                files: [
                    'media-element.min.css',
                    'app.combined.min.css'
                ]
            },
            js: {
                base: '/static/js/',
                files: [
                    'media-element.min.js',
                    'app.combined.min.js'
                ]
            }
        },
        colors: {
            header: '#ff6600',
            body: '#0a0',
            footer: '1232ai'
        },
        api: {
            book: {
                getCosts: function () {},
                getTitle: function () {},
                getEan: function () {}
            }
        },
        user: {
            name: 'Wallie',
            email: 'foobar@baz.com',
            zipcode: '1211BL'
        },
        security: {
            ip: {
                blocked: [
                    '127.0.0.1',
                    '192.0.2.197'
                ]
            },
            companies: [
                'Samsung',
                'Philips',
                'LG'
            ]
        },
        coordinates: {
            x: 10,
            y: 30,
            z: 90
        },
        version: 1.2,
        environment: 'production',
        debug: false,
        displayErrors: true,

        what: {
            nope: undefined,
            noWay: null,
            notANumber: 'a' * 9
        }
    };

    function dump(obj) {
        var json = JSON.stringify(obj, null, '\t');

        json.replace(/\\"/g,"\uFFFF"); //U+ FFFF
        json = json.replace(/\"([^"]+)\":/g,"$1:").replace(/\uFFFF/g,"\\\"");

        console.log(json);
    }

    var errors = quack.getErrors(config, 'user', {
        zipcode: quack.ARRAY
    });

    dump(errors);

    var errors = quack.getErrors(config, 'resources.css', {
        files: function(x) {
            return _.isNumber(x);
        }
    });

    dump(errors);

    var errors = quack.getErrors(config, 'what', {
        nope: quack.NUMBER,
        noWay: quack.NULL
    });

    dump(errors);

    var errors = quack.getErrors(config, 'media', {
        'align.vertical.y': _.isNumber
    });

    dump(errors);

    var errors = quack.getErrors(config, 'media', {
        align: quack.OBJECT,
        'Xalign.vertical.y': quack.NUMBER,
        src: quack.ZIPCODE,
        ratios: quack.ARRAY
    });

    dump(errors);

    var errors = quack.getErrors(config, 'media', {
        align: quack.NUMBER,
        'align.vertical.y': quack.STRING,
        src: quack.ARRAY,
        ratios: /^foo$/
    });

    dump(errors);

    var errors = quack.getErrors(config, 'resources.css', {
        files: quack.all(/^[0-9\-\_\.\/]+.css$/)
    });

    dump(errors);

    var errors = quack.getErrors(config, 'media', {
        align: {
            vertical: {
                x: quack.ARRAY,
                y: quack.NUMBER
            }
        }
    });

    dump(errors);

    var errors = quack.getErrors(config, 'foobar', {
        'align.vertical.y': quack.STRING
    });

    dump(errors);

    var errors = quack.getErrors(config, {
        'align.vertical.y': quack.STRING
    });

    dump(errors);


    describe('regex test', function () {
        it("the second css file path ('resources.css.files.1') should start with 'app' and end with '.css'", function () {
            var res = quack.test(config, 'resources.css.files.1', /^app([a-z0-9\._\-]+)css$/);
            expect(res).toBe(true);
        });
    });

    describe('null, undefined an unexisting paths', function () {

        it("unexisting path to not be a boolean", function () {
            var res = quack.isBoolean(config, 'foo.bar');
            expect(res).toBe(false);
        });

        it("unexisting path to return false and not null", function () {
            var res = quack.isNull(config, 'foo.bar');
            expect(res).toBe(false);
        });

        it("unexisting path to return false and not undefined", function () {
            var res = quack.isUndefined(config, 'foo.bar');
            expect(res).toBe(false);
        });

        it("undefined to be undefined", function () {
            var res = quack.isUndefined(config, 'what.nope');
            expect(res).toBe(true);
        });

        it("null to be null", function () {
            var res = quack.isNull(config, 'what.noWay');
            expect(res).toBe(true);
        });

        it("validate null undefined and NaN values as true when we expect them", function () {
            var res = quack.validate(config, 'what', {
                nope: quack.UNDEFINED,
                noWay: quack.NULL,
                notANumber: quack.NAN
            });
            expect(res).toBe(true);
        });

        it("validate null and undefined values as true, path that doesn't exist as false", function () {
            var res = quack.validate(config, 'what', {
                nope: quack.UNDEFINED,
                noWay: quack.NULL,
                wut: quack.UNDEFINED
            });
            expect(res).toBe(false);
        });
    });

    describe('collection test', function () {

        it("should match every value as an ip-address", function () {
            var valid = quack.validate(config, 'security.ip', {
                blocked: quack.all(quack.validator.regexp.Ip)
            });
            expect(valid).toBe(true);
        });

        it("should match any of the values to 'Philips'", function () {
            var valid = quack.validate(config, 'security', {
                companies: quack.any(/^Philips$/)
            });
            expect(valid).toBe(true);
        });

        it("should validate whitelist", function () {
            var valid = quack.validate(config, 'security', {
                companies: quack.whitelist(['LG', 'Philips', 'Samsung'])
            });
            expect(valid).toBe(true);
        });

        it("should validate blacklist", function () {
            var valid = quack.validate(config, 'security', {
                companies: quack.blacklist(['xSamsung', 'xPhilips'])
            });
            expect(valid).toBe(true);
        });

        it("should validate range", function () {
            var valid = quack.validate(config, {
                coordinates: quack.range(10, 90)
            });
            expect(valid).toBe(true);
        });

        it("should test if resources.css.files only contains css filenames", function () {
            var valid = quack.validate(config, 'resources.css', {
                files: quack.all(/^[a-z0-9\-\_\.\/]+.css$/)
            });
            expect(valid).toBe(true);
        });

        it("test every value in an object'", function () {
            var valid = quack.validate(config, {
                coordinates: quack.any(_.isNumber)
            });
            expect(valid).toBe(true);
        });
    });

    describe('boolean test', function () {

        it("make distinctions between null and false", function () {
            var res = quack.get(config, 'debug');
            expect(res).toBe(false);
        });

        it("true to be a boolean", function () {
            var res = quack.get(config, 'displayErrors');
            expect(res).toBe(true);
        });

        it("Validate correctly on boolean constants", function () {
            var valid = quack.validate(config, {
                debug: quack.BOOLEAN,
                displayErrors: quack.BOOLEAN
            });
            expect(valid).toBe(true);
        });

    });


    describe('custom validaton', function () {

        it("user.email should be an email", function () {
            var valid = quack.isEmail(config, 'user.email');
            expect(valid).toBe(true);
        });

        it("should validate email and zipcode", function () {

            var valid = quack.validate(config, 'user', {
                name: quack.STRING,
                email: quack.EMAIL,
                zipcode: quack.ZIPCODE
            });

            expect(valid).toBe(true);
        });

        it("should validate hex colors", function () {

            var valid = quack.validate(config, 'colors', {
                header: quack.HEX,
                body: quack.HEX
            });

            expect(valid).toBe(true);
        });

        it("should recognize invalid hex value", function () {
            var valid = quack.isHex(config, 'colors.footer');
            expect(valid).not.toBe(true);
        });

    });

    describe('validate', function () {

        it("should validate positive on multiple keys", function () {

            var valid = quack.validate(config, 'media', {
                align: quack.OBJECT,
                'align.vertical.y': quack.NUMBER,
                src: quack.STRING,
                ratios: quack.ARRAY
            });

            expect(valid).toBe(true);
        });

        it("should validate positive on multiple keys through an object", function () {

            var valid = quack.validate(config, 'media', {
                align: {
                    vertical: {
                        x: quack.STRING,
                        y: quack.NUMBER
                    }
                }
            });

            expect(valid).toBe(true);
        });

        it("should validate negative on at least 1 key", function () {

            var valid = quack.validate(config, 'media', {
                align: quack.OBJECT,
                src: quack.STRING,
                ratios: quack.REGEXP
            });

            expect(valid).not.toBe(true);
        });

        it("should validate regex literals", function () {

            var valid = quack.validate(config, {
                'user.name': /^[a-zA-Z]+$/,
                'media.src': /^[a-z\/]+$/
            });

            expect(valid).toBe(true);
        });

        it("should validate positive on a map with a mixed validation structure", function () {

            var valid = quack.validate(config, {
                'media.align': {
                    vertical: {
                        x: quack.STRING,
                        y: quack.NUMBER
                    }
                },
                colors: {
                    header: quack.HEX
                },
                'api.book.getEan': quack.FUNCTION,
                'user.name':  /^[a-zA-Z]+$/
            });

            expect(valid).toBe(true);
        });

        it("should throw error exception because of unknown validation type", function () {

            expect(function () {
                quack.validate(config, 'media', {
                    align: 'foo',
                    src: quack.STRING,
                    ratios: quack.REGEXP
                });
            }).toThrowError('Unknown validation type');

        });
    });

    describe('resources.js.files', function () {

        it('to be an array', function () {
            var res = quack.isArray(config, 'resources.js.files');
            expect(res).toBe(true);
        });

        it('to not be a number', function () {
            var res = quack.isNumber(config, 'resources.js.files');
            expect(res).not.toBe(true);
        });

        it('to be an array with 2 elements', function () {
            var files = quack.get(config, 'resources.js.files');
            expect(files.length).toBe(2);
        });

    });

    describe('api.book', function () {

        it('should have the methods getCosts, getTitle and getEan', function () {
            var res = quack.hasApi(config, 'api.book', ['getCosts', 'getTitle', 'getEan']);
            expect(res).toBe(true);
        });

    });

    describe('unexisting properties', function () {

        it('getting x.y.z should return undefined', function () {
            var res = quack.get(config, 'x.y.z');
            expect(res).toBeUndefined();
        });

    });

    describe('set new properties', function () {

        it("x.y.z should now be 'alphabet soup'", function () {
            quack.set(config, 'x.y.z', 'alphabet soup');
            var res = quack.get(config, 'x.y.z');
            expect(res).toBe('alphabet soup');
        });

    });


}());