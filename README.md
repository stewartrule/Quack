## Quack

Quack helps you to validate object structures and values.

It has a dependency on [underscore.js](http://underscorejs.org/) and is still under development.


#### Consider this dummy object
```js
var agenda = {
  companies: [{
    name: 'Angry Bytes',
    events: [{
      start: new Date(2011, 3, 10, 12, 30), // error
      name: 'Lunch',
      invited: ['Employee', 'Boss', 'Customer']
    }, {
      start: new Date(2014, 3, 11, 12, 30),
      name: 'Party',
      invited: ['Boss', 'Customer']
    }, {
      start: new Date(2014, 3, 12, 12, 30),
      name: 'BBQ',
      invited: ['Employee', 'Customer']
    }]
  }, {
    name: 'Two Screen',
    events: [{
      start: new Date(2014, 3, 10, 12, 30),
      name: 'Birthday', // error
      invited: ['Employee', 'Boss', 'Customer']
    }, {
      start: new Date(2014, 3, 11, 12, 30),
      name: 'Party',
      invited: ['Boss', 'Customer']
    }, {
      start: new Date(2014, 3, 12, 12, 30),
      name: 'BBQ',
      invited: ['Employee', 'Customer with a vengeance!'] // error
    }]
  }]
};
```

#### validate
```js
var response = quack.validate(agenda, {
  companies: quack.all({
    events: quack.all({
      start: quack.date({
        min: new Date(2012, 3, 11, 12, 30)
      }),
      name: quack.string({
        min: 3,
        max: 5
      }),
      invited: quack.all(quack.match(/^[A-Za-z]+$/))
    })
  })
});
```

#### response
```js
{
 "valid": false,
 "errors": {
  "companies": {
   "valid": false,
   "errors": {
    "0": {
     "valid": false,
     "errors": {
      "events": {
       "valid": false,
       "errors": {
        "0": {
         "valid": false,
         "errors": {
          "start": {
           "valid": false,
           "value": "2011-04-10T10:30:00.000Z",
           "expected": "Date",
           "detected": "Date",
           "constraints": {
            "min": "2012-04-11T10:30:00.000Z"
           },
           "pathExists": true
          }
         },
         "numErrors": 1
        }
       },
       "expected": [
        "Array",
        "Object"
       ],
       "detected": "Array",
       "numErrors": 1,
       "pathExists": true
      }
     },
     "numErrors": 1
    },
    "1": {
     "valid": false,
     "errors": {
      "events": {
       "valid": false,
       "errors": {
        "0": {
         "valid": false,
         "errors": {
          "name": {
           "valid": false,
           "value": "Birthday",
           "expected": "String",
           "detected": "String",
           "constraints": {
            "max": 5
           },
           "pathExists": true
          }
         },
         "numErrors": 1
        },
        "2": {
         "valid": false,
         "errors": {
          "invited": {
           "valid": false,
           "errors": {
            "1": {
             "valid": false,
             "value": "Customer with a vengeance!",
             "expected": "String",
             "detected": "String",
             "constraints": {},
             "pattern": "/^[A-Za-z]+$/",
             "match": false
            }
           },
           "expected": [
            "Array",
            "Object"
           ],
           "detected": "Array",
           "numErrors": 1,
           "pathExists": true
          }
         },
         "numErrors": 1
        }
       },
       "expected": [
        "Array",
        "Object"
       ],
       "detected": "Array",
       "numErrors": 2,
       "pathExists": true
      }
     },
     "numErrors": 1
    }
   },
   "expected": [
    "Array",
    "Object"
   ],
   "detected": "Array",
   "numErrors": 2,
   "pathExists": true
  }
 },
 "numErrors": 1
}
```

