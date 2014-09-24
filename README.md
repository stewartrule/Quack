
#### Considering this dummy object
```js
var config = {
    resources: {
        css: {
            base: '/static/css/',
            files: [
                'media-element.min.css',
                'app.combined.min.css'
            ]
        },
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
        email: 'walter@angrybytes.com',
        zipcode: '1211BL'
    },
    version: 1.2,
    dev: 'production'
};


```
### Type checking

* isArray(object, path)
* isBoolean(object, path)
* isDate(object, path)
* isElement(object, path)
* isFunction(object, path)
* isNumber(object, path)
* isObject(object, path)
* isRegExp(object, path)

### Pattern checking
* isEmail(object, path)

```js
var valid = quack.isEmail(config, 'user.email');
```

* isHex(object, path)
* isIp(object, path)
* isSlug(object, path)
* isString(object, path)
* isZipcode(object, path)


### Multiple fields
* validate(object, path, map)

```js
var valid = quack.validate(config, 'media', {
    align: quack.OBJECT,
    src: quack.STRING,
    ratios: quack.ARRAY
});
```
### Custom regexp

* test(object, path, regExp)

```js
var match = quack.test(config, 'resources.css.files.1', /^app([a-z0-9\._\-]+)css$/);
```

### Api check

* hasApi(object, path, methods)

```js
var hasApi = quack.hasApi(config, 'api.book', ['getCosts', 'getTitle', 'getEan']);
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
* clone(object, src, dest)



