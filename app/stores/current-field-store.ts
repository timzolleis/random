import {Field} from "~/types/field";
import {create} from "zustand";
import {persist} from "zustand/middleware";

type FieldStore = {
    fields: Field[];
    addField: (field: Field) => void;
    removeField: (field: Field) => void;
    updateField: (field: Field) => void;
    setFields: (fields: Field[]) => void;
    clearFields: () => void;
}

export const useFieldStore = create<FieldStore>()(
    persist(
        (set, state) => ({
            fields: [],
            addField: (field) => {
                if (state().fields.find((item) => item.id === field.id)) {
                    return;
                }
                set((state) => ({
                    fields: [
                        field,
                        ...state.fields,
                    ],
                }));
            },
            updateField: (field) => {
                set((state) => ({
                    fields: state.fields.map((oldField) => {
                        if (oldField.id === field.id) {
                            return field;
                        }
                        return oldField;
                    }),
                }));
            },
            removeField: (field) => {
                set((state) => ({
                    fields: state.fields.filter((oldField) => oldField.id !== field.id),
                }));
            },
            clearFields: () => {
                set({
                    fields: [],
                });
            },
            setFields: (fields) => {
                set({
                    fields,
                });
            }
        }),
        {
            name: 'fields',
        }
    )
);