(function () {

    'use strict';

    function unquoteJsonKeys(json) {
        json.replace(/\\"/g,"\uFFFF"); //U+ FFFF
        return json.replace(/\"([^"]+)\":/g,"$1:").replace(/\uFFFF/g,"\\\"");
    }

    function replaceElement(key, value) {
        if (_.has(value, 'nodeType') && _.has(value, 'nodeName')) {
            return '<' + value.nodeName + '>';
        }
        return value;
    }

    function inspect(obj) {
        var json = JSON.stringify(obj, replaceElement, ' ');
        json = unquoteJsonKeys(json);
        console.log(json);
    }

    var response = quack.validate(config, {
        agenda: quack.all(
            quack.all(
                quack.date({
                    min: new Date(2014, 3, 10, 13, 30),
                    max: new Date(2014, 3, 12, 13, 30)
                })
            )
        )
    });

    inspect(response);

    return;

    var response = quack.validate(window, {
        users: quack.all({
            name: quack.string(),
            screen_name: quack.string(),
            id: quack.integer(),
            id_str: quack.string(),
            connections: quack.all(quack.pattern(/ollow/))
        })
    });

    // inspect(response);


    var response = quack.validate(config, {
        listOfObjects: quack.all({
            start: quack.date()
        })
    });

    // inspect(response);

    var response = quack.validate(config, {
        'media.ratios': quack.all({
            start: quack.date()
        })
    });

    // inspect(response);

    var response = quack.validate(config, {
        events: quack.all({
            start: quack.date(),
            name: quack.string(),
            invited: quack.all(quack.pattern(/^[A-Za-z]+$/))
        })
    });

    // inspect(response);



    var response = quack.validate(config, {
        coordinates: quack.all(quack.integer({ min: 20, max: 90 }))
    });

    //inspect(response);

    var response = quack.validate(config, {
        regexp: {
            Email: quack.regExp({
                global: true,
                multiline: false,
                ignoreCase: false,
                lastIndex: 0
            }),
            Ip: quack.regExp({
                global: true,
                multiline: false,
                ignoreCase: false,
                lastIndex: 1
            })
        }
    });

    //inspect(response);

    var response = quack.validate(config, {
        'coordinates.x': quack.all(quack.pattern(/combined/))
    });

    // inspect(response);


    var response = quack.validate(config, {
        what: {
            nope: quack.nil(),
            noWay: quack.nil(),
            notANumber: quack.nan()
        }
    });

    // inspect(response);

    var response = quack.validate(config, 'resources', {
        'css': quack.object(),
        'css.files': quack.number(),
        js: {
            files: quack.all(quack.pattern(/combined/))
        }
    });

    // inspect(response);

    var response = quack.validate(config, {
        coordinates: quack.nil(),
        user: {
            email: quack.pattern(/^\S+@\S+\_\S+$/)
        },
        dom: {
            body: quack.element(),
            fragment: quack.element()
        }
    });

    inspect(response);

    var response = quack.validate(config, {
        align: quack.object(),
        'align.vertical.y': quack.number(),
        src: quack.string(),
        ratios: quack.array(),
        'dom.body': quack.number(),
        dom: quack.all(quack.element())
    });

    // inspect(response);

    var response = quack.validate(config, {
        'media.align': {
            vertical: {
                x: quack.string(),
                y: quack.number()
            }
        },
        colors: {
            header: quack.pattern(/^#?([a-f0-9]{6}|[a-f0-9]{3})$/)
        },
        'api.book.getEan': quack.func(),
        'api.book': quack.api(['getEan', 'getCosts', 'getTitleS'])
    });

    // inspect(response);

}());