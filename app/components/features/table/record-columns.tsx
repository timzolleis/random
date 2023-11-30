import {Field} from "~/types/field";
import {RandomDataRecord} from "~/routes/_index";
import {cn} from "~/utils";

export const recordColumns = (fields: Field[]) => {
    return fields.map(field => ({
        id: field.id,
        header: () => {
            return <p className={"px-2 py-1 font-semibold font-mono"}>{field.name}</p>
        },
        cell: ({ row }) => {
            const original = row.original as RandomDataRecord
            const entry = original.find(item => item.field === field.id)
            return <p className={cn("text-left font-mono px-2 py-1", entry?.validationApplied ? "bg-red-500/20 h-6" : "")}>{entry?.value}</p>
        },
    }))
}