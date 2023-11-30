import {Field} from "~/types/field";
import {Validation} from "~/stores/validation-store";

type ExtractedFormData = {
    fields: Field[];
    validations: Validation[];
};

export function extractFormData(formData: FormData): ExtractedFormData {
    const result: ExtractedFormData = {
        fields: [],
        validations: []
    };

    for (const [key, value] of formData.entries()) {
        const parts = key.split('.');
        const id = parts[1];

        if (key.startsWith('field')) {
            let field = result.fields.find(f => f.id === id);
            if (!field) {
                field = {id, name: '', type: ''};
                result.fields.push(field);
            }
            field[parts[2] as keyof Field] = value.toString();
        } else if (key.startsWith('validation')) {
            let validation = result.validations.find(v => v.id === id);
            if (!validation) {
                validation = {id, name: '', type: '', fieldId: ''};
                result.validations.push(validation);
            }
            validation[parts[2] as keyof Validation] = value.toString();
        }
    }

    return result;
}