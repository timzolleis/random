import {create} from "zustand";
import {persist} from "zustand/middleware";

export type Validation = {
    id: string;
    name: string
    type: "MISSING" | "INVALID"
    fieldId: string
}


type ValidationStore = {
    validations: Validation[]
    addValidation: (validation: Validation) => void
    removeValidation: (validationId: string) => void
    clearValidations: () => void
    setValidations: (validations: Validation[]) => void
}

export const useValidationStore = create<ValidationStore>()(
    persist(
        (set, state) => ({
            validations: [],
            addValidation: (validation) => {
                if (state().validations.find((item) => item.id === validation.id)) {
                    return;
                }
                set((state) => ({
                    validations: [
                        validation,
                        ...state.validations
                    ],
                }));
            },
            removeValidation: (validationId) => {
                set((state) => ({
                    validations: state.validations.filter((oldValidation) => oldValidation.id !== validationId),
                }));
            },
            clearValidations: () => {
                set({
                    validations: [],
                });
            },
            setValidations: (validations) => {
                set({
                    validations,
                });
            }
        }),
        {
            name: 'validations',
        }
    )
);