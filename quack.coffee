
# Kwek kwek!
Lib = do ->

    # List of primary types
    primaryTypes = ['Function', 'Array', 'Number', 'String', 'Boolean', 'Date', 'RegExp', 'Element', 'Null', 'Undefined', 'NaN', 'Object']

    # Detect the type of a value
    getTypeOf = (value) ->
        _.find primaryTypes, (type) ->
            fn = 'is' + type
            _[fn](value)

    # Check if value is a subtype of Object
    isObjectSubType = (value) ->
        _.isFunction(value) || _.isArray(value) || _.isDate(value) || _.isRegExp(value) || _.isElement(value)

    # Check if object is a regular object
    isPlainObject = (value) ->
        _.isObject(value) and not isObjectSubType(value)

    # List of validators
    validators = do () ->

        # Create a base response object
        createResponse = (value, expected) ->
            {
                valid: true,
                value: value,
                expected: expected,
                detected: getTypeOf(value),
                constraints: {}
            }

        # Return validators
        ret = {

            plainObject: (options) ->
                options or= {}
                (value) ->
                    response = createResponse(value, 'Plain Object')
                    unless isPlainObject(value)
                        response.valid = false
                    return response

            number: (options) ->
                options or= {}
                (value) ->
                    response = createResponse(value, 'Number')
                    unless _.isNumber(value)
                        response.valid = false
                        return response
                    if _.isNumber(options.min) and value < options.min
                        response.valid = false
                        response.constraints.min = options.min
                    if _.isNumber(options.max) and value > options.max
                        response.valid = false
                        response.constraints.max = options.max
                    response

            integer: (options) ->
                options or= {}
                (value) ->
                    response = createResponse(value, 'Integer')
                    isInt = _.isNumber(value) && parseInt(value, 10) is value
                    unless isInt
                        response.valid = false
                        return response
                    if _.isNumber(options.min) and value < options.min
                        response.valid = false
                        response.constraints.min = options.min
                    if _.isNumber(options.max) and value > options.max
                        response.valid = false
                        response.constraints.max = options.max
                    response

            regExp: (options) ->
                options or= {}
                (value) ->
                    response = createResponse(value, 'RegExp')
                    response.difference = {}
                    unless _.isRegExp(value)
                        response.valid = false
                        return response

                    _.each ['global', 'multiline', 'ignoreCase', 'lastIndex'], (param) ->
                        if _.has(options, param)
                            if value[param] isnt options[param]
                                response.difference[param] = {
                                    detected: value[param],
                                    expected: options[param]
                                }

                    response.valid = _.keys(response.difference).length is 0
                    response

            func: (options) ->
                options or= {}
                (value) ->
                    response = createResponse(value, 'Function')
                    unless _.isFunction(value)
                        response.valid = false
                    if _.isNumber(options.length) and options.length isnt value.length
                        response.valid = false
                        response.constraints.length = false
                    response

            string: (options) ->
                options or= {}
                (value) ->
                    response = createResponse(value, 'String')
                    unless _.isString(value)
                        response.valid = false
                        return response
                    if _.isNumber(options.min) and value.length < options.min
                        response.valid = false
                        response.constraints.min = options.min
                    if _.isNumber(options.max) and value.length > options.max
                        response.valid = false
                        response.constraints.max = options.max
                    response

            match: (regExp) ->
                (value) ->
                    response = createResponse(value, 'String')
                    unless _.isString(value)
                        response.valid = false
                        return response
                    valid = regExp.test(value)
                    response.pattern = regExp.toString()
                    response.match = valid
                    response.valid = valid
                    response

            date: (options) ->
                options or= {}
                (value) ->
                    response = createResponse(value, 'Date')
                    unless _.isDate(value)
                        response.valid = false
                        return response
                    time = value.getTime()
                    if _.isDate(options.min)
                        minTime = options.min.getTime()
                        if time < minTime
                            response.valid = false
                            response.constraints.min = options.min
                    if _.isDate(options.max)
                        maxTime = options.max.getTime()
                        if time > maxTime
                            response.valid = false
                            response.constraints.max = options.max
                    response

            api: (methods) ->
                (value) ->
                    response = createResponse(value, ['Object', 'Array'])
                    unless _.isObject(value)
                        response.valid = false
                        return response
                    missing = []
                    if _.isArray(methods)
                        missing = _.reject methods, (method) ->
                            _.has(value, method) and _.isFunction(value[method])
                    else if _.isObject(methods)
                        missing = _.reject methods, (numArgs, method) ->
                            unless _.has(value, method)
                                return false
                            fn = value[method]
                            _.isFunction(fn) and fn.length is numArgs
                    valid = missing.length is 0
                    response.valid = valid
                    unless valid
                        response.missing = missing
                    response
        }

        # Generate validators that are optionless at the moment
        simpleValidators = {
            object: 'Object'
            nan: 'NaN'
            nil: 'Null'
            undef: 'Undefined'
            bool: 'Boolean'
            array: 'Array'
            element: 'Element'
        }

        _.each simpleValidators, (type, methodName) ->
            ret[methodName] = (options) ->
                options or= {}
                (value) ->
                    response = createResponse(value, type)
                    unless _['is' + type](value)
                        response.valid = false
                    response
            return

        # return validators
        ret


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

    # Check if object has a value at a given path that passes the given validator
    has = (parent, path, validator) ->
        unless hasPath(parent, path)
            return false
        nested = get(parent, path)
        validator(nested)

    # Check if object has a value at a given path that matches the given regex
    test = (parent, path, regExp) ->
        str = get(parent, path)
        str && _.isString(str) && regExp.test(str)

    # Get value at a given path and clone it if is an object
    clone = (parent, src) ->
        nested = get(parent, src)
        if nested && _.isObject(nested)
            return _.clone(nested)
        nested

    # Initialize Quack API
    api = { get, set, test, clone }

    # Validate object with a validation map
    validate = (obj, map) ->
        errors = {}

        unless isPlainObject(map)
            throw new Error('Map for comparison should be a plain object')

        _.each map, (validator, key) ->
            pathExists = hasPath(obj, key)
            nested = get(obj, key)

            if _.isFunction(validator)
                response = validator(nested)
                response.pathExists = pathExists
                unless response.valid
                    errors[key] = response

            else if _.isRegExp(validator)
                validator = validators.match(validator)
                response = validator(nested)
                response.pathExists = pathExists
                unless response.valid
                    errors[key] = response

            else if _.isObject(validator)
                nestedErrors = validate(nested, validator)
                unless nestedErrors.valid
                    _.each nestedErrors.errors, (err, k) ->
                        errors[key + '.' + k] = err
            else
                throw new Error('Unknown validator type')

        numErrors = _.keys(errors).length
        { valid: numErrors is 0, errors: errors, numErrors: numErrors }

    # Validate object
    api.validate = (parent, path, map) ->
        if isPlainObject(path)
            return validate(parent, path)
        unless _.isString(path)
            throw new Error('path/key should be a string')
        pathExists = hasPath(parent, path)
        nested = get(parent, path)
        if pathExists
            return validate(nested, map)
        { valid: false, pathExists: pathExists }

    # Fallback plain object validator for delegated validators
    plainObjectValidator = validators.plainObject()

    # Delegate values of arrays to a new validation-map
    getValidatorDelegate = (map) ->
        (value) ->
            if isPlainObject(value)
                return validate(value, map)
            return plainObjectValidator(value)

    # Returns a validator function to test the values of an array or object
    getCollectionValidator = (method, validator) ->

        # if validator is a plain object it should be passed to validate for every item in the array
        if isPlainObject(validator)
            validator = getValidatorDelegate(validator)

        # Return collection validator
        (value) ->

            # Create default response
            collectionResponse = {
                valid: false,
                errors: {},
                expected: ['Array', 'Object'],
                detected: getTypeOf(value)
            }

            # Allow arrays and plain objects
            testable = _.isArray(value) or isPlainObject(value)

            # Quick test
            unless testable
                return collectionResponse

            # Gather responses
            responses = _.map value, (item) ->
                validator(item)

            # Check if 'all' or 'any' are valid
            valid = _[method] responses, (response) ->
                response.valid

            if valid
                collectionResponse.valid = valid
                return collectionResponse

            # Detect errors
            errors = {}
            _.each responses, (response, key) ->
                unless response.valid
                    errors[key] = response

            # Update the response
            numErrors = _.keys(errors).length
            collectionResponse.valid = numErrors is 0
            collectionResponse.errors = errors
            collectionResponse.numErrors = numErrors
            collectionResponse


    # Checks if all of the values in the list pass the predicate truth test
    api.all = (validator) ->
        getCollectionValidator('all', validator)

    # Checks if any of the values in the list pass the predicate truth test
    api.any = (validator) ->
        getCollectionValidator('any', validator)


    # Merge validator with quack api
    _.extend api, validators

    # Return API
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
