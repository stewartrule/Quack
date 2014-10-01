window.config = {
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
    listOfObjects: [
        { start: new Date() },
        function(){},
        /^foobar$/,
        []
    ],
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
    },

    regexp: {
        Email: /^.+@.+\..+$/g,
        Zipcode: /^[0-9]{4}[A-Z]{2}$/,
        Hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/,
        Ip: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        Slug: /^[a-z0-9\-\_]+$/
    },

    agenda: [
        { start: new Date(2014, 3, 10, 12, 30), stop: new Date(2016, 3, 10, 13, 30) },

        { start: new Date(2014, 3, 10, 12, 30), stop: new Date(2014, 3, 10, 13, 30) },
        { start: new Date(2014, 3, 10, 12, 30), stop: new Date(2014, 3, 10, 13, 30) },
        { start: new Date(2014, 3, 10, 12, 30), stop: new Date(2014, 3, 10, 13, 30) },
        { start: new Date(2014, 3, 10, 12, 30), stop: new Date(2014, 3, 10, 13, 30) },

        { start: new Date(2014, 3, 11, 12, 30), stop: new Date(2014, 3, 11, 13, 30) },
        { start: new Date(2014, 3, 12, 12, 30), stop: new Date(2014, 3, 12, 13, 30) }
    ],

    events: [
        { start: new Date(2014, 3, 10, 12, 30), name: 'Lunch', invited: ['Employee', 'Boss', 'Customer'] },
        { start: new Date(2014, 3, 11, 12, 30), name: 'Party', invited: ['Boss', 'Customer'] },
        { start: new Date(2014, 3, 12, 12, 30), name: 'BBQ',   invited: ['Employee', 'Customer'] }
    ]
};