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
    version: 1.2,
    dev: 'production'
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
var name = '';
if (quack.isString(config, 'user.name')) {
    name = quack.get(config, 'user.name');
}
```

### Manipulate

* set(object, path, val)
```js
quack.set(config, 'x.y.z', 'alphabet soup');

var res = quack.get(config, 'x.y.z');
// 'alphabet soup'
```

* clone(object, src, dest)


### Validator

for quick value checks you can also use the validator that quack uses internally

```js
var validator = quack.validator;

validator.isEmail('foobar@baz.com');
validator.isHex('#ff6600');
validator.isZipcode('1211AB');
```


