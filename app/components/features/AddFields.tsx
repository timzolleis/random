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
import {ShortcutHint} from "~/components/features/shortcut/shortcut-hint";
import {useFieldStore} from "~/stores/current-field-store";
import {createId} from "@paralleldrive/cuid2";
import {useStepStore} from "~/stores/step-store";
import {FieldComponent} from "~/components/features/field/field";
import {ClientOnly} from "remix-utils/client-only";


type DialogProps = {
    open: boolean,
    setOpen: (value: boolean) => void
}
const StepSelector = () => {
    const stepStore = useStepStore()
    return <div className={"px-3 py-1 flex items-center gap-2 text-muted-foreground"}>
        <SectionNumber>{stepStore.step}/2</SectionNumber>
        <div className={"hover:cursor-pointer"}>
            {stepStore.step === 1 && <MoveRight onClick={() => stepStore.increment()}/>}
            {stepStore.step === 2 && <MoveLeft onClick={() => stepStore.decrement()}/>}
        </div>
    </div>
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
    const [fieldType, setFieldType] = useState("")
    const [fieldName, setFieldName] = useState("")
    const fieldStore = useFieldStore()
    const stepStore = useStepStore()
    const handleSelectName = (value: string) => {
        setFieldName(value)
        stepStore.increment()
    }
    const handleSelectFieldType = (value: string) => {
        setFieldType(value)
        fieldStore.addField({id: createId(), name: fieldName, type: fieldType})
        reset()
    }
    const reset = () => {
        stepStore.reset()
        setFieldName("")
        setFieldType("")
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
    const fieldStore = useFieldStore();
    useHotkeys("f", () => setShowAddFieldDialog(true), {preventDefault: true})

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
                        {() => <div className={"flex flex-wrap items-center gap-2 mt-3"}>
                            {fieldStore.fields.map(field => (
                                    <FieldComponent field={field} key={field.id}/>
                                )
                            )}
                            <Button size={"sm"}
                                    className={"rounded-full bg-transparent text-primary border-primary border-dotted shadow-none border hover:bg-transparent"}>
                                <ShortcutHint shortcut={"F"}/>
                                Add
                                field</Button>
                        </div>}
                    </ClientOnly>
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