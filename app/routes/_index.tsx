import type {MetaFunction} from "@remix-run/node";
import {DataFunctionArgs, json} from "@remix-run/node";
import {AddFields} from "~/components/features/AddFields";
import {getValue} from "~/utils/faker.server";
import {createId} from "@paralleldrive/cuid2";
import {redis} from "~/utils/redis.server";
import {getGenerationSession} from "~/utils/session.server";
import {extractFormData} from "~/utils/forms.server";
import {useLoaderData, useSearchParams} from "@remix-run/react";
import {Field} from "~/types/field";
import {Validation} from "~/stores/validation-store";
import {DataTable} from "~/components/ui/table/data-table";
import {recordColumns} from "~/components/features/table/record-columns";
import {Section, SectionContainer, SectionDescription, SectionHeader, SectionNumber} from "~/components/ui/section";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import {Label} from "~/components/ui/label";

export const meta: MetaFunction = () => {
    return [
        {title: "New Remix App"},
        {name: "description", content: "Welcome to Remix!"},
    ];
};


export const loader = async ({request}: DataFunctionArgs) => {
    const searchParams = new URL(request.url).searchParams.get("maxEntries");
    const maxEntries = searchParams ? parseInt(searchParams) : 50;
    const session = await getGenerationSession(request)
    const lastGeneration = session.getLastGeneration();
    if (!lastGeneration) {
        return json({lastGeneration: null});
    }
    const generation = await redis.get(lastGeneration)
    if (!generation) {
        return json({lastGeneration: null});
    }
    const parsed = JSON.parse(generation) as Generation
    const paginatedRecords = parsed.records.slice(0, maxEntries)
    return json({
        lastGeneration: {
            ...parsed,
            records: paginatedRecords
        }
    });
}

export type RandomDataRecord = {
    field: string,
    value: string | null,
    validationApplied: boolean
}[]


type Generation = {
    fields: Field[],
    validations: Validation[],
    records: RandomDataRecord[]
}

export const action = async ({request}: DataFunctionArgs) => {
    const formData = await request.formData();
    const jsonData = formData.get("jsonData")
    const numberOfRows = formData.get("numberOfRows")
    if (!jsonData) {
        return json({error: "No data provided"})
    }
    const recordCount = parseInt(numberOfRows?.toString() || "100")

    const parsed = JSON.parse(jsonData?.toString()) as { fields: Field[], validations: Validation[] } | null
    if (!parsed) {
        return json({error: "Invalid data provided"})
    }
    const records: RandomDataRecord[] = [];
    //We then generate a preview...other values are generated lazily
    for (let i = 0; i < recordCount; i++) {
        const fakeData = parsed.fields.map(field => {
            const validation = parsed.validations.find(validation => validation.fieldId === field.id)
            const func = getValue(field.type, validation)
            return {
                field: field.id,
                value: func.value,
                validationApplied: func.applied,
            }
        })
        records.push(fakeData)
    }
    //Store the generation in the database
    const generationId = createId()
    const generation = {
        id: generationId,
        fields: parsed.fields,
        validations: parsed.validations,
        records,
        createdAt: new Date().toISOString()
    }
    await redis.set(generationId, JSON.stringify(generation))
    const session = await getGenerationSession(request)
    session.setLastGeneration(generationId)
    //Return paginated results
    return json({generationId}, {
        headers: {
            "Set-Cookie": await session.commit(),
        }
    })
}

const Pagination = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const maxEntries = searchParams.get("maxEntries")
    return (<div className={"grid gap-2 py-1"}>
            <Label>Number of results</Label>
            <Select defaultValue={maxEntries ?? undefined} onValueChange={value => {
                searchParams.set("maxEntries", value)
                setSearchParams(searchParams)
            }}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Theme"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="1000">1000</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}


export default function Index() {
    const loaderData = useLoaderData<typeof loader>()
    return (
        <section className="w-full py-12">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-medium font-inter tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                            Generate random data. Fast.
                        </h1>
                        <p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400">
                            Generate vast amounts of random data in a variety of formats using a beautiful and intuitive
                            interface.
                        </p>
                    </div>
                    <div className={"rounded-md border p-4 w-full max-w-5xl border-dashed "}>
                        <SectionContainer>
                            <AddFields/>
                            <Section>
                                <SectionNumber>03</SectionNumber>
                                <SectionHeader>Results</SectionHeader>
                                <SectionDescription>
                                    View your generated data here
                                </SectionDescription>
                                <div className={"mt-4"}>
                                    {loaderData.lastGeneration && (
                                        <>
                                            <Pagination/>
                                            <DataTable columns={recordColumns(loaderData.lastGeneration.fields)}
                                                       data={loaderData.lastGeneration.records}/>
                                        </>
                                    )}
                                </div>
                            </Section>

                        </SectionContainer>
                    </div>
                </div>

            </div>
        </section>
    );
}
