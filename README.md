## Quack

Quack helps you to validate object structures and values.

It has a dependency on [underscore.js](http://underscorejs.org/) and is still under development.


#### Consider this dummy object
```js
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
    displayErrors: true
};
```


### Checking multiple paths
* validate(object, path, map)

```js
var valid = quack.validate(config, 'media', {
    align: quack.OBJECT,
    'align.vertical.y': quack.NUMBER,
    src: quack.STRING,
    ratios: quack.ARRAY
});
// true
```
* validate(object, map)

```js
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
// true
```

```js
var valid = quack.validate(config, {
    'user.name': /^[a-zA-Z]+$/,
    'media.src': /^[a-z\/]+$/
});
// true
```

#### Test array and object values
```js
// security.ip.blocked should contain an array with only ips
var valid = quack.validate(config, 'security.ip', {
    blocked: quack.all(quack.validator.regexp.Ip)
});

// companies should contain at least one entry with the string 'Philips'
var valid = quack.validate(config, 'security', {
    companies: quack.any(/^Philips$/)
});

// resources.css.files should contain only css filenames
var valid = quack.validate(config, 'resources.css', {
    files: quack.all(/^[a-z0-9\-\_\.\/]+.css$/)
});

// config.coordinates should only contains numbers
var valid = quack.validate(config, {
    coordinates: quack.all(_.isNumber)
});

// company only valid if it's present in the whitelist
var valid = quack.validate(config, 'security', {
    companies: quack.whitelist(['LG', 'Philips', 'Samsung'])
});

// company only valid if it's not in the blacklist
var valid = quack.validate(config, 'security', {
    companies: quack.blacklist(['xSamsung', 'xPhilips'])
});

// coordinates are only valid between 10 and 90 (inclusive)
var valid = quack.validate(config, {
    coordinates: quack.range(10, 90)
});
```


#### Available constants
* FUNCTION
* OBJECT
* ARRAY
* NUMBER
* STRING
* BOOLEAN
* DATE
* REGEXP
* ELEMENT
* EMAIL
* ZIPCODE
* HEX
* IP
* SLUG


### Checking a single path

* isArray(object, path)
* isBoolean(object, path)
* isDate(object, path)
* isElement(object, path)
* isFunction(object, path)
* isNumber(object, path)
* isObject(object, path)
* isRegExp(object, path)

```js
var res = quack.isNumber(config, 'resources.js.files');
// false

var res = quack.isArray(config, 'resources.js.files');
// true
```

### Pattern checking

* isEmail(object, path)
* isHex(object, path)
* isIp(object, path)
* isSlug(object, path)
* isString(object, path)
* isZipcode(object, path)

```js
var valid = quack.isEmail(config, 'user.email');
// true
```

### Custom regexp

* test(object, path, regExp)

```js
var match = quack.test(
    config,
    'resources.css.files.1',
    /^app([a-z0-9\._\-]+)css$/
);
// true
```

### Check for an interface or API

* hasApi(object, path, methods)
* hasApi(object, methods)

```js
var hasApi = quack.hasApi(
    config,
    'api.book',
    ['getCosts', 'getTitle', 'getEan']
);
// true
```

or

```js
var hasApi = quack.hasApi(
    config.api.book,
    ['getCosts', 'getTitle', 'getEan']
);
// true
```

```js
function orderableProduct(instance) {
    return quack.hasApi(instance, ['order', 'getProductId']);
}

if (orderableProduct(something)) {
    something.order();
}
```

### Get nested property

* get(object, path)

```js
var name = quack.get(config, 'user.name');
```

* clone(object, path)

```js
// same as get but creates a shallow clone of objects
var book = quack.clone(config, 'api.book');
```

### Manipulate

* set(object, path, val)
```js
quack.set(config, 'x.y.z', 'alphabet soup');

var res = quack.get(config, 'x.y.z');
// 'alphabet soup'
```


### Validator

for quick value checks you can also use the validator that quack uses internally

```js
var validator = quack.validator;

validator.isEmail('foobar@baz.com');
validator.isHex('#ff6600');
validator.isZipcode('1211AB');
```


