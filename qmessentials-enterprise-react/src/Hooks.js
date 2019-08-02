import moment from 'moment'

export function useCriteria(resultType) {

    const parse = value => {
        if (!resultType) {
            return null;
        }
        if (!value) {
            return null;
        }
        switch (resultType) {
            case 'Numeric':
                return getNumericRangeCriteria(value) || getNumericOperatorCriteria(value)
            case 'Character':
                return getStringRangeCriteria(value) || getStringLikeCriteria(value) || getStringPatternCriteria(value)
            case 'DateTime':
                return null
            case 'TimeSpan':
                return null
            case 'Boolean':
                return getBooleanTrueValue(value) || getBooleanFalseValue(value)
            default:
                return null
        }
    }

    const format = criteria => {
        if (!resultType) {
            return null
        }
        if (!criteria) {
            return null
        }
        switch (resultType) {
            case 'Numeric':
                switch (criteria.type) {
                    case 'Range':
                        return (criteria.isMinInclusive ? '[' : '(') + criteria.min + '-' + criteria.max + (criteria.isMaxInclusive ? ']' : ')')
                    case 'Operator':
                        return (criteria.operator + ' ' + criteria.operand)
                    default:
                        return null
                }
            case 'Character':
                switch (criteria.type) {
                    case 'Like':
                        return `Like '${criteria.pattern}'`;
                    case 'Pattern':
                        return criteria.pattern;
                    case 'Range':
                        return (criteria.isMinInclusive ? '[' : '(') + criteria.min + '-' + criteria.max + (criteria.isMaxInclusive ? ']' : ')')
                    default:
                        return null
                }
            case 'DateTime':
                return null
            case 'TimeSpan':
                return null
            case 'Boolean':
                return criteria ? 'True' : 'False'
            default:
                return null
        }
    }

    return [parse, format]

}


const getNumericRangeCriteria = value => {
    let match = value.match(/^(?<open>\(|\[)?(?<min>\d+\.?\d*)(\s*-\s*)?(?<max>\d+\.?\d*)(?<close>\)|\])?$/)
    if (!match) {
        return null
    }
    const isMinInclusive = match.groups['open'] === '(' ? false : true
    const min = +match.groups['min']
    const max = +match.groups['max']
    const isMaxInclusive = match.groups['close'] === ')' ? false : true
    return {
        type: 'Range',
        min,
        isMinInclusive,
        max,
        isMaxInclusive
    }
}

const getNumericOperatorCriteria = value => {
    let match = value.match(/^(?<operator>[=<>]+)?\s*(?<operand>\d+\.?\d*\s*$)/)
    if (!match) {
        return null
    }
    const operator = match.groups['operator'] || '='
    if (!['=', '<>', '<', '<=', '>=', '>'].includes(operator)) {
        console.warn('Invalid operator')
        return null
    }
    const operand = +match.groups['operand']
    return {
        type: 'Operator',
        operator,
        operand
    }
}

const getStringRangeCriteria = value => {
    const match = value.match(/^(?<open>\(|\[)?(?<min>\d+\.?\d*)(\s*-\s*)?(?<max>\d+\.?\d*)(?<close>\)|\])?$/)
    if (!match) {
        return null
    }
    const isMinInclusive = match.groups['open'] === '(' ? false : true
    const min = match.groups['min']
    const max = match.groups['max']
    const isMaxInclusive = match.groups['close'] === ')' ? false : true
    return {
        type: 'Range',
        min,
        isMinInclusive,
        max,
        isMaxInclusive
    }
}

const getStringLikeCriteria = value => {
    const match = value.match(/^Like ['"]?(?<content>[\w\s*%]+)['"]?$/)
    if (!match) {
        return null
    }
    return {
        type: 'Like',
        pattern: match.groups['content']
    }
}

const getStringPatternCriteria = value => {
    //Can't find any other way to do this
    try {
        new RegExp(value)
        return {
            type: 'Pattern',
            pattern: value
        }
    }
    catch (error) {
        return null
    }
}

const getDateRangeCriteria = value => {
    
}

const getBooleanTrueValue = value => {
    if (value === true) {
        return true
    }
    if (['y', 'yes', 't', 'true'].includes(value.toLocaleLowerCase())) {
        return true
    }
    if (+value > 0) {
        return true
    }
    return null
}

const getBooleanFalseValue = value => {
    if (value === false) {
        return false
    }
    if (['n', 'no', 'f', 'false'].includes(value.toLocaleLowerCase())) {
        return false
    }
    if (+value === 0) {
        return false
    }
    return null
}
