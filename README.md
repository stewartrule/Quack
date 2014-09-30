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
```





```js
var response = quack.validate(config, {
    what: {
        nope: quack.nil(),
        noWay: quack.nil(),
        notANumber: quack.nan()
    }
});
```

```json
{
	"valid": false,
	"errors: {
		"what.nope": {
			"valid": false,
			"expected": "Null",
			"received": "Undefined",
			"constraints": {},
			"regExp": false,
			"pathExists": true
		}
	},
	"numErrors": 1
}
```

### Nested errors
```js
var response = quack.validate(config, 'resources', {
    'css': quack.object(),
    'css.files': quack.number(),
    js: {
        files: quack.all(quack.regExp(/combined/))
    }
});

/*
{
	valid: false,
	errors: {
		css.files: {
			valid: false,
			expected: "Number",
			received: "Array",
			constraints: {},
			regExp: false,
			pathExists: true
		},
		js.files: {
			valid: false,
			errors: [
				{
					valid: false,
					expected: "/combined/",
					received: "media-element.min.js",
					constraints: {},
					regExp: true
				},
				{
					valid: false,
					expected: "/combined/",
					received: "media-video.min.js",
					constraints: {},
					regExp: true
				},
				{
					valid: false,
					expected: "/combined/",
					received: "media-audio.min.js",
					constraints: {},
					regExp: true
				}
			],
			expected: [
				"Array",
				"Object"
			],
			received: "Array",
			pathExists: true
		}
	},
	numErrors: 2
}
*/
```

```js
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

/*
{
	valid: false,
	errors: {
		coordinates: {
			valid: false,
			expected: "Null",
			received: "Object",
			constraints: {},
			regExp: false,
			pathExists: true
		},
		user.email: {
			valid: false,
			expected: "/^\\S+@\\S+\\_\\S+$/",
			received: "foobar@baz.com",
			constraints: {},
			regExp: true,
			pathExists: true
		},
		dom.fragment: {
			valid: false,
			expected: "Element",
			received: "Object",
			constraints: {},
			regExp: false,
			pathExists: true
		}
	},
	numErrors: 3
}
*/
```

```js
var response = quack.validate(config, {
    align: quack.object(),
    'align.vertical.y': quack.number(),
    src: quack.string(),
    ratios: quack.array(),
    dom: quack.any(quack.element())
});

/*
{
	valid: false,
	errors: {
		align: {
			valid: false,
			expected: "Object",
			received: "Undefined",
			constraints: {},
			regExp: false,
			pathExists: false
		},
		align.vertical.y: {
			valid: false,
			expected: "Number",
			received: "Undefined",
			constraints: {},
			regExp: false,
			pathExists: false
		},
		src: {
			valid: false,
			expected: "String",
			received: "Undefined",
			constraints: {},
			regExp: false,
			pathExists: false
		},
		ratios: {
			valid: false,
			expected: "Array",
			received: "Undefined",
			constraints: {},
			regExp: false,
			pathExists: false
		}
	},
	numErrors: 4
}
*/
```

## Validation
* validate

### Tests
* array
* bool
* date
* element
* func
* integer
* nan
* nil
* number
* object
* regExp
* string
* undef
* api

### Get / Set
* get
* set
* clone

### Collection value test
* all
* any


