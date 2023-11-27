import {useRef, useState} from "react";
import {Button} from "~/components/ui/button";
import {Section, SectionContainer, SectionDescription, SectionHeader, SectionNumber} from "~/components/ui/section";
import {Dialog, DialogContent} from "~/components/ui/dialog";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "~/components/ui/command";
import {Input} from "~/components/ui/input";
import {useHotkeys} from "react-hotkeys-hook";
import {availableFields} from "~/constants/available-fields";
import {ShortcutHint} from "~/components/features/shortcut/shortcut-hint";
import {useFieldStore} from "~/stores/current-field-store";
import {createId} from "@paralleldrive/cuid2";
import {useStepStore} from "~/stores/step-store";
import {FieldComponent} from "~/components/features/field/field";
import {ClientOnly} from "remix-utils/client-only";
import {Reorder} from "framer-motion";
import {StepSelector} from "~/components/features/steps/step-selector";
import {AddValidationDialog} from "~/components/features/validation/add-validation-dialog";
import {useValidationStore} from "~/stores/validation-store";
import {ValidationRuleComponent} from "~/components/features/validation/validation-rule";
import {useFetcher} from "@remix-run/react";
import {Slider} from "~/components/ui/slider";


type DialogProps = {
    open: boolean,
    setOpen: (value: boolean) => void
}


type FieldDialogProps = DialogProps & {
    defaultValue?: string,
    onSelect: (value: string) => void,
}

const FieldNameDialog = (props: FieldDialogProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    return <Dialog open={props.open} onOpenChange={props.setOpen}>
        <DialogContent className={"gap-1 shadow-lg"}>
            <StepSelector/>
            <Input className={"text-lg"} variant={"ghost"} ref={inputRef} defaultValue={props.defaultValue}
                   onKeyDown={(event) => {
                       if (event.key === "Enter") {
                           props.onSelect(event.currentTarget.value)
                       }
                   }} placeholder={"Field name"}/>
        </DialogContent>
    </Dialog>

}


const FieldTypeDialog = (props: FieldDialogProps) => {
    return <CommandDialog defaultValue={props.defaultValue} open={props.open} onOpenChange={props.setOpen}>
        <StepSelector/>
        <CommandInput placeholder="Type a command or search..."/>
        <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Settings">
                {availableFields.map(field => (
                    <CommandItem onSelect={props.onSelect} key={field}>{field}</CommandItem>
                ))}
            </CommandGroup>
        </CommandList>
    </CommandDialog>
}

const AddFieldDialog = ({open, setOpen}: {
    open: boolean,
    setOpen: (value: boolean) => void
}) => {
    const [fieldName, setFieldName] = useState("")
    const fieldStore = useFieldStore()
    const stepStore = useStepStore()
    const handleSelectName = (value: string) => {
        setFieldName(value)
        stepStore.increment()
    }
    const handleSelectFieldType = (value: string) => {
        fieldStore.addField({id: createId(), name: fieldName, type: value})
        reset()
    }
    const reset = () => {
        stepStore.reset()
        setFieldName("")
        setOpen(false)
    }

    if (stepStore.step === 1) {
        return <FieldNameDialog open={open} setOpen={setOpen} defaultValue={fieldName}
                                onSelect={handleSelectName}/>
    } else {
        return <FieldTypeDialog open={open} setOpen={setOpen}
                                onSelect={handleSelectFieldType}/>
    }
}


export const AddFields = () => {
    const [showAddFieldDialog, setShowAddFieldDialog] = useState(false)
    const [showAddValidationDialog, setShowAddValidationDialog] = useState(false)
    const [sliderValue, setSliderValue] = useState([10])
    const fieldStore = useFieldStore();
    const validationStore = useValidationStore();
    useHotkeys("f", () => setShowAddFieldDialog(true), {preventDefault: true})
    useHotkeys("r", () => setShowAddValidationDialog(true), {preventDefault: true})
    const fetcher = useFetcher();
    const clear = () => {
        fieldStore.clearFields();
        validationStore.clearValidations();
    }
    const generate = () => {
        fetcher.submit({
            data: JSON.stringify({
                fields: fieldStore.fields,
                validations: validationStore.validations,
                records: sliderValue[0]
            })
        }, {
            method: "post",
            action: "/generate"
        })
    }


    return (
        <>
            <AddFieldDialog open={showAddFieldDialog} setOpen={setShowAddFieldDialog}/>
            <SectionContainer>
                <Section>
                    <SectionNumber>01</SectionNumber>
                    <SectionHeader>Add fields</SectionHeader>
                    <SectionDescription>
                        Add fields to your dataset. Drag to reorder
                    </SectionDescription>
                    <ClientOnly>
                        {() => <Reorder.Group axis={"x"} onReorder={(value) => fieldStore.setFields(value)}
                                              values={fieldStore.fields}>
                            <div className={"flex flex-wrap items-center gap-2 mt-3"}>
                                {fieldStore.fields.map(field => (
                                        <Reorder.Item whileDrag={{scale: 1.1}} value={field} key={field.id}>
                                            <FieldComponent field={field} key={field.id}/>
                                        </Reorder.Item>
                                    )
                                )}
                                <Button size={"sm"}
                                        onClick={() => setShowAddFieldDialog(true)}
                                        className={"rounded-full bg-transparent text-primary border-primary border-dotted shadow-none border hover:bg-transparent"}>
                                    <ShortcutHint shortcut={"F"}/>
                                    Add
                                    field</Button>
                            </div>
                        </Reorder.Group>}
                    </ClientOnly>
                </Section>
                <Section>
                    <SectionNumber>02</SectionNumber>
                    <SectionHeader>Data validation</SectionHeader>
                    <SectionDescription>
                        You can include corrupt data to test your application's error handling
                    </SectionDescription>
                    <div className={"mt-3"}>
                        <Button size={"sm"}
                                onClick={() => setShowAddValidationDialog(true)}
                                className={"rounded-full bg-transparent text-primary border-primary border-dotted shadow-none border hover:bg-transparent"}>
                            <ShortcutHint shortcut={"R"}/>
                            Add
                            rule</Button>
                    </div>
                    <AddValidationDialog open={showAddValidationDialog} setOpen={setShowAddValidationDialog}/>
                    <div className={"grid gap-2 mt-3"}>
                        <ClientOnly>
                            {() => validationStore.validations.map(validation => (
                                <ValidationRuleComponent key={validation.id} validation={validation}/>
                            ))}
                        </ClientOnly>

                    </div>
                </Section>
                <div className={"text-center space-y-2"}>
                    <Slider defaultValue={sliderValue} onValueChange={(value) => setSliderValue(value)} max={10000}/>
                    <p className={"text-muted-foreground text-xs"}>{sliderValue} Records</p>
                </div>

                <div className={"flex flex-col w-full items-center gap-2"}>
                    <Button onClick={() => generate()} className={"w-[200px]"}>Generate</Button>
                    <Button onClick={() => clear()} variant={"secondary"} size={"sm"} type={"button"}
                            className={"hover:cursor-pointer"}>Clear
                        everything
                    </Button>
                </div>
            </SectionContainer></>
    )
}