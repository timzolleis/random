import {faker} from "@faker-js/faker";
import type {Validation} from "~/stores/validation-store"
import {randomTrue} from "~/utils/pseudo-random.server";

const fieldTypeToFakerFuntion = {
    "firstname": () => {
        return faker.person.firstName();
    },
    "lastname": () => {
        return faker.person.lastName();
    },
    "address": () => {
        return faker.location.streetAddress();
    },
    "email": () => {
        return faker.internet.email()
    }
} as const;


function selectRandomHandler(handlerToExclude: string) {
    const keys = Object.keys(fieldTypeToFakerFuntion);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    if (randomKey === handlerToExclude) {
        selectRandomHandler(handlerToExclude)
    }
    return fieldTypeToFakerFuntion[randomKey as keyof typeof fieldTypeToFakerFuntion]();
}


export function getValue(fieldType: string, validation?: Validation) {
    const generatorFunction = fieldTypeToFakerFuntion[fieldType.toLowerCase() as keyof typeof fieldTypeToFakerFuntion];
    if (!generatorFunction) {
        throw new Error(`No generator defined for field: ${fieldType}`);
    }
    if (validation) {
        if (validation.type === "MISSING") {
            const shouldReturnMissing = randomTrue();
            if (shouldReturnMissing) {
                return {validation, applied: true, value: null};
            }
        } else if (validation.type === "INVALID") {
            const shouldReturnInvalid = randomTrue();
            if (shouldReturnInvalid) {
                return {validation, applied: true, value: selectRandomHandler(fieldType)};
            }
        }
    }

    return {validation, applied: false, value: generatorFunction()};
}