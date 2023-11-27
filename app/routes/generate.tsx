import type {DataFunctionArgs} from "@remix-run/node";
import type {Field} from "~/types/field";
import type {Validation} from "~/stores/validation-store";
import {getValue} from "~/utils/faker.server";
import {fakerDA} from "@faker-js/faker";


export const action = async ({request}: DataFunctionArgs) => {
    const fd = await request.formData();
    const countSearchParam = new URL(request.url).searchParams.get("count")
    const recordCount = countSearchParam ? parseInt(countSearchParam) : 100
    const data = fd.get("data")
    if (!data) {
        throw new Error("Invalid request")
    }
    const parsed = JSON.parse(data.toString()) as { fields: Field[], validations: Validation[], records: number }
    const records = [];
    //We then generate a preview...other values are generated lazily
    for (let i = 0; i < recordCount; i++) {
        const fakeData = parsed.fields.map(field => {
            const validation = parsed.validations.find(validation => validation.fieldId === field.id)
            return {
                field: field.type,
                value: getValue(field.type, validation)
            }
        })
        records.push(fakeData)
    }
    console.log(records)
    //Return paginated results
    return {
        count: recordCount,
        data: records
    }
}