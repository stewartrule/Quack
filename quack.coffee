
# Kwek kwek!
Lib = do ->

    # Validator
    validator = do ->

        # Initialize api object
        api = {}

        # List of types we can delegate to underscore.js
        delegate = ['Function', 'Array', 'Number', 'String', 'Boolean', 'Date', 'RegExp', 'Element', 'Null', 'Undefined', 'NaN', 'Object']

        # Delegate to underscore.js
        _.each delegate, (type) ->
            fn = 'is' + type
            api[fn] = _[fn]

        # List of regular expressions
        regexp = {
            Email: /^.+@.+\..+$/
            Zipcode: /^[0-9]{4}[A-Z]{2}$/
            Hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/
            Ip: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
            Slug: /^[a-z0-9\-\_]+$/
        }

        # Make expressions publicly available
        api.regexp = regexp

        # Create validation functions of all of the expressions
        _.each regexp, (rgxp, type) ->
            fn = 'is' + type
            api[fn] = (val) ->
                val && rgxp.test(val)

        # Create a list with names of all the validation types
        api.types = delegate.concat(_.keys(regexp))

        # Return validator API
        api

    # Shortcut to the validator types
    types = validator.types

    # Check if an object has a certain API/Interface
    hasApi = (obj, methods) ->
        _.all methods, (method) ->
            _.has(obj, method) && _.isFunction(obj[method])

    # Check if object has a key and that key holds an object
    hasObject = (parent, key) ->
        _.has(parent, key) && _.isObject(parent[key])

    # Path separator
    dot = '.'

    # Check if key is a path
    hasDot = (str) ->
        str && str.indexOf(dot) > -1

    # Get value at a given path
    get = (parent, path) ->
        unless path
            return undefined
        if hasDot(path)
            path = path.split(dot)
            initial = _.initial(path)
            last = _.last(path)
            for key in initial
                unless hasObject(parent, key)
                    return undefined
                parent = parent[key]
            if _.has(parent, last)
                return parent[last]
            return undefined
        if _.has(parent, path)
            return parent[path]
        undefined

    # Check if all of the keys are in order
    hasPath = (parent, path) ->
        unless path
            return false
        if hasDot(path)
            path = path.split(dot)
            initial = _.initial(path)
            last = _.last(path)
            for key in initial
                unless hasObject(parent, key)
                    return false
                parent = parent[key]
            return _.has(parent, last)
        return _.has(parent, path)

    # Set value at a given path
    set = (parent, path, val) ->
        if hasDot(path)
            path = path.split(dot)
            initial = _.initial(path)
            last = _.last(path)
            for key in initial
                if hasObject(parent, key)
                    parent = parent[key]
                else
                    parent[key] = {}
                    parent = parent[key]
            parent[last] = val
        else
            parent[path] = val

    # Check if object has a value at a given path that passes the given truth test
    has = (parent, path, fn) ->
        unless hasPath(parent, path)
            return false
        nested = get(parent, path)
        validator[fn](nested)

    # Check if object has a value at a given path that matches the given regex
    test = (parent, path, regExp) ->
        unless api.isString(parent, path)
            return false
        str = get(parent, path)
        regExp.test(str)

    # Get value at a given path and clone it if is an object
    clone = (parent, src) ->
        nested = get(parent, src)
        unless nested?
            return null
        if _.isObject(nested)
            return _.clone(nested)
        nested

    # Initialize API object
    api = { get, set, test, clone }

    # Create validation methods for all of the types
    _.each types, (type) ->
        fn = 'is' + type
        api[fn] = (parent, path) ->
            has parent, path, fn

    # Check if a value has a certain API/Interface
    api.hasApi = (parent, path, methods) ->
        if _.isArray(path)
            return hasApi(parent, path)
        if api.isObject(parent, path)
            obj = api.get(parent, path)
            return hasApi(obj, methods)
        return false

    # Make the validator publicly available for simple checks
    api.validator = validator

    # Define constants which are used to check against within validate
    _.each types, (type) ->
        api[type.toUpperCase()] = type

    # Local validation function that analyzes the object and compares it to the map
    validate = (obj, map) ->
        if _.isObject(map) && not _.isRegExp(map)
            return _.all map, (type, key) ->
                if _.isObject(type)
                    if _.isRegExp(type)
                        return test(obj, key, type)
                    nested = get(obj, key)
                    if nested?
                        if _.isFunction(type)
                            return type(nested)
                        return validate(nested, type)
                    return false
                unless _.contains(types, type)
                    throw new Error('Unknown validation type')
                fn = 'is' + type
                return has(obj, key, fn)
        return false

    detectType = (val) ->
        _.find types, (type) ->
            fn = 'is' + type
            console.log(fn)
            validator[fn](val)

    getErrors = (obj, map) ->
        errors = {}
        if _.isObject(map) && not _.isRegExp(map)
            _.each map, (type, key) ->

                pathExists = hasPath(obj, key)
                nested = get(obj, key)
                detected = detectType(nested)

                doesNotMatch = []

                if _.isObject(type)

                    # Validate by regex
                    if _.isRegExp(type)
                        valid = test(obj, key, type)
                        unless valid
                            unless api.isString(obj, key)
                                doesNotMatch.push(api.STRING)
                            doesNotMatch.push(api.REGEXP)
                            errors[key] = { detected, doesNotMatch, pathExists }
                        return

                    # Validate by nested map
                    if nested?
                        if _.isFunction(type)
                            valid = type(nested)
                            doesNotMatch.push('callback')
                            unless valid
                                errors[key] = { detected, doesNotMatch, pathExists }
                            return

                        subErrors = getErrors(nested, type)
                        unless subErrors.valid
                            _.each subErrors.errors, (err, k) ->
                                errors[key + '.' + k] = err
                        return

                    errors[key] = { detected, doesNotMatch, pathExists }

                unless _.contains(types, type)
                    throw new Error('Unknown validation type')

                # Validate by constant
                fn = 'is' + type
                valid = has(obj, key, fn)
                unless valid
                    errors[key] = { detected, doesNotMatch: [type], pathExists }

        numErrors = _.keys(errors).length
        { valid: numErrors is 0, errors: errors, numErrors: numErrors }

    api.getErrors = (parent, path, map) ->
        if _.isObject(path)
            return getErrors(parent, path)
        unless _.isString(path)
            throw new Error('path/key should be a string')
        pathExists = hasPath(parent, path)
        nested = get(parent, path)
        if nested
            return getErrors(nested, map)
        detected = detectType(nested)
        errors = {}
        errors[path] = { detected, doesNotMatch: [api.OBJECT], pathExists }
        { valid: false, errors: errors, numErrors: 1 }

    # Validate object or a deeper object inside the object
    api.validate = (parent, path, map) ->
        if _.isObject(path)
            return validate(parent, path)
        nested = get(parent, path)
        nested && validate(nested, map)

    # Returns a validator function to test the values of an array of object
    getCollectionValidator = (method, type) ->
        (value) ->
            if _.isArray(value) or _.isObject(value)
                return _[method] value, (item) ->
                    if _.isRegExp(type)
                        return type.test(item)
                    if _.contains(types, type)
                        fn = 'is' + type
                        return validator[fn](item)
                    if _.isFunction(type)
                        return type(item)
                    throw new Error('Unknown validation type to validate collections')
            return false

    # Checks if all of the values in the list pass the predicate truth test
    api.all = (type) ->
        getCollectionValidator('all', type)

    # Checks if any of the values in the list pass the predicate truth test
    api.any = (type) ->
        getCollectionValidator('any', type)

    # Checks if all of the values in the list are in the whitelist
    api.whitelist = (values) ->
        api.all (value) ->
            _.contains(values, value)

    # Checks if none of the values in the list are in the blacklist
    api.blacklist = (values) ->
        api.all (value) ->
            not _.contains(values, value)

    # Checks if all of the values in the list are in a certain range
    api.range = (min, max) ->
        api.all (value) ->
            value >= min && value <= max

    # Return Api
    api


# Export quack
if typeof define is 'function' and define.amd
    # AMD
    define -> Lib
else if typeof exports is 'object'
    # CommonJS
    module.exports = Lib
else
    # Global
    window.quack = Lib


