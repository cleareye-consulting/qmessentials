import { useEffect, useState } from "react";

export default function useValidation(validationMap, formState, activeInputField) {

    const [validationState, setValidationState] = useState({invalidCount: 0})

    useEffect(() => {
        const newValidationState = { invalidCount: 0}
        for (let field in formState) {
            const validation = validationMap[field]
            const isValid = field === activeInputField || validation.test(formState[field])
            if (!isValid) {
                newValidationState.invalidCount += 1
            }
            newValidationState[field] = {isValid, message: !isValid ? validation.message : null}
        }
            setValidationState(newValidationState)
    }, [validationMap, formState, activeInputField])

    return validationState

}