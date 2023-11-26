import {Field} from "~/types/field";
import {create} from "zustand";
import {persist} from "zustand/middleware";

type CurrentFieldStore = {
    fieldList: Field[],
    addField: (field: Field) => void,
    removeField: (field: Field) => void,
    clearFieldList: () => void,
}

export const useCurrentFieldStore = create<CurrentFieldStore>()(
    persist((set, state) => ({
        
    }))
)