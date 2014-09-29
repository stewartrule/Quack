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
                    'media-video.min.js',
                    'app.combined.min.js',
                    'media-audio.min.js'
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

        dom: {
            body: document.body,
            fragment: document.createDocumentFragment()
        },

        what: {
            nope: undefined,
            noWay: null,
            notANumber: 'a' * 9
        }
    };

    function unquoteJsonKeys(json) {
        json.replace(/\\"/g,"\uFFFF"); //U+ FFFF
        return json.replace(/\"([^"]+)\":/g,"$1:").replace(/\uFFFF/g,"\\\"");
    }

    function dump(obj) {
        var json = JSON.stringify(obj, null, '\t');
        json = unquoteJsonKeys(json);
        console.log(json);
    }

    var response = quack.validate(config, {
        what: {
            nope: quack.nil(),
            noWay: quack.nil(),
            notANumber: quack.nan()
        }
    });

    dump(response);

    var response = quack.validate(config, 'resources', {
        'css': quack.object(),
        'css.files': quack.number(),
        js: {
            files: quack.all(quack.regExp(/combined/))
        }
    });

    dump(response);

    var response = quack.validate(config, {
        coordinates: quack.nil(),
        user: {
            // email: quack.regExp(/^\S+@\S+\_\S+$/)
            email: /^\S+@\S+\_\S+$/
        },
        dom: {
            body: quack.element(),
            fragment: quack.element()
        }
    });

    dump(response);

    var response = quack.validate(config, {
        align: quack.object(),
        'align.vertical.y': quack.number(),
        src: quack.string(),
        ratios: quack.array(),
        dom: quack.any(quack.element())
    });

    dump(response);

    var response = quack.validate(config, {
        'media.align': {
            vertical: {
                x: quack.string(),
                y: quack.number()
            }
        },
        colors: {
            header: quack.regExp(/^#?([a-f0-9]{6}|[a-f0-9]{3})$/)
        },
        'api.book.getEan': quack.func(),
        'api.book': quack.api(['getEan', 'getCosts', 'getTitleS'])
    });

    dump(response);

}());