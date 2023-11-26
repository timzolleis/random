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
import {MoveLeft, MoveRight} from "lucide-react";
import {availableFields} from "~/constants/available-fields";
import type {Field} from "~/types/field";
import {ShortcutHint} from "~/components/features/shortcut/shortcut-hint";


type DialogProps = {
    open: boolean,
    setOpen: (value: boolean) => void
}

type StepSelectProps = {
    step: number,
    setStep: (value: number) => void
}



const StepSelector = ({step, setStep}: { step: number, setStep: (value: number) => void }) => {
    return <div className={"px-3 py-1 flex items-center gap-2 text-muted-foreground"}>
        <SectionNumber>{step}/2</SectionNumber>
        <div className={"hover:cursor-pointer"}>
            {step === 1 && <MoveRight onClick={() => setStep(step + 1)}/>}
            {step === 2 && <MoveLeft onClick={() => setStep(step - 1)}/>}
        </div>
    </div>
}


type FieldDialogProps = DialogProps & StepSelectProps & {
    defaultValue?: string,
    onSelect: (value: string) => void,
}

const FieldNameDialog = (props: FieldDialogProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    return <Dialog open={props.open} onOpenChange={props.setOpen}>
        <DialogContent className={"gap-1 shadow-lg"}>
            <StepSelector step={props.step} setStep={props.setStep}/>
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
        <StepSelector step={props.step} setStep={props.setStep}/>
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

const AddFieldDialog = ({setFields, open, setOpen}: {
    setFields: (value: Field) => void,
    open: boolean,
    setOpen: (value: boolean) => void
}) => {
    const [step, setStep] = useState(1)
    const [fieldName, setFieldName] = useState("")
    const [fieldType, setFieldType] = useState("")
    const handleSelectName = (value: string) => {
        setFieldName(value)
        setStep(2)
    }
    const handleSelectFieldType = (value: string) => {
        setFieldType(value)
        setFields({name: fieldName, type: fieldType})
        reset()
    }

    const reset = () => {
        setStep(1)
        setFieldName("")
        setFieldType("")
        setOpen(false)
    }

    if (step === 1) {
        return <FieldNameDialog setStep={setStep} step={step} open={open} setOpen={setOpen}
                                onSelect={handleSelectName}/>
    } else if (step === 2) {
        return <FieldTypeDialog setStep={setStep} step={step} open={open} setOpen={setOpen}
                                onSelect={handleSelectFieldType}/>
    }
}


export const AddFields = () => {
    const [showAddFieldDialog, setShowAddFieldDialog] = useState(false)
    const [fields, setFields] = useState<Field[]>([])
    useHotkeys("f", () => setShowAddFieldDialog(true), {preventDefault: true})
    const setField = (value: Field) => {
        setFields([...fields, value])
    }

    return (
        <>
            <AddFieldDialog setFields={setField} open={showAddFieldDialog} setOpen={setShowAddFieldDialog}/>
            <SectionContainer>
                <Section>
                    <SectionNumber>01</SectionNumber>
                    <SectionHeader>Add fields</SectionHeader>
                    <SectionDescription>
                        Add fields to your dataset. Drag to reorder
                    </SectionDescription>
                    <div className={"flex flex-wrap items-center gap-2 mt-3"}>
                        {fields.map(field => (
                                <div key={field.name}
                                     className={"rounded-full bg-primary border-primary inline-flex items-center text-primary-foreground h-8 px-3 text-xs shadow-none border"}>{field.name}</div>
                            )
                        )}
                        <Button size={"sm"}
                                className={"rounded-full bg-transparent text-primary border-primary border-dotted shadow-none border hover:bg-transparent"}>
                            <ShortcutHint shortcut={"F"}/>
                            Add
                            field</Button>
                    </div>
                </Section>
                <Section>
                    <SectionNumber>02</SectionNumber>
                    <SectionHeader>Include corrupt data</SectionHeader>
                    <SectionDescription>
                        You can include corrupt data to test your application's error handling
                    </SectionDescription>
                </Section>
            </SectionContainer></>
    )
}