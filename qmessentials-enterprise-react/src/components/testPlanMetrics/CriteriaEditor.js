import React from 'react'
import { useCriteria } from '../../Hooks'

const NumericCriteriaEditor = props => {
    return (
        <input className="form-control" type="text" defaultValue={props.format(props.criteria)} placeholder="[1-5) includes 1, 2, 3, and 4; <, <=, >=, >, = and <> also allowed" onChange={event => props.setCriteria(props.parse(event.target.value))} />
    )
}

const StringCriteriaEditor = props => {
    return (
        <input className="form-control" type="text" defaultValue={props.format(props.criteria)} placeholder="Like 'A*' | [A-K) | JavaScript regular expression" onChange={event => props.setCriteria(props.parse(event.target.value))} />
    )
}

const BooleanCriteriaEditor = props => {
    return (
        <select className="form-control" type="text" defaultValue={props.format(props.criteria)} onChange={event => props.setCriteria(props.parse(event.target.value))}>
            <option></option>
            <option>True</option>
            <option>False</option>
        </select>
    )
}

export default props => {
    const [parse, format] = useCriteria(props.resultType)
    switch (props.resultType) {
        case 'Numeric':
            return <NumericCriteriaEditor setCriteria={props.setCriteria} criteria={props.criteria} parse={parse} format={format} />
        case 'Character':
            return <StringCriteriaEditor setCriteria={props.setCriteria} criteria={props.criteria} parse={parse} format={format} />
        case 'Boolean':
            return <BooleanCriteriaEditor setCriteria={props.setCriteria} criteria={props.criteria} parse={parse} format={format} />
        default:
            return (<></>)
    }    
}