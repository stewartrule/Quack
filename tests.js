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
        version: 1.2,
        dev: 'production'
    };

    describe('regex test', function () {

        it("the second css file path ('resources.css.files.1') should start with 'app' and end with '.css'", function () {
            var res = quack.test(config, 'resources.css.files.1', /^app([a-z0-9\._\-]+)css$/);
            expect(res).toBe(true);
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
                'api.book.getEan': quack.FUNCTION
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

        it('x.y.z should be null', function () {
            var res = quack.get(config, 'x.y.z');
            expect(res).toBeNull();
        });

    });

    describe('set new properties', function () {

        it("x.y.z should now be 'alphabet soup'", function () {
            quack.set(config, 'x.y.z', 'alphabet soup');
            var res = quack.get(config, 'x.y.z');
            expect(res).toBe('alphabet soup');
        });

    });

    describe('clone book api to new video api', function () {

        quack.clone(config, 'api.book', 'api.video');

        it('should have the methods getCosts, getTitle and getEan', function () {
            var res = quack.hasApi(config, 'api.video', ['getCosts', 'getTitle', 'getEan']);
            expect(res).toBe(true);
        });

        it('should have added a new method getDuration to api.video', function () {
            quack.set(config, 'api.video.getDuration', function () {});
            var res = quack.hasApi(config, 'api.video', ['getCosts', 'getTitle', 'getEan', 'getDuration']);
            expect(res).toBe(true);
        });

        it('book api should not have the new getDuration method', function () {
            var res = quack.hasApi(config, 'api.book', ['getCosts', 'getTitle', 'getEan', 'getDuration']);
            expect(res).not.toBe(true);
        });

    });

}());