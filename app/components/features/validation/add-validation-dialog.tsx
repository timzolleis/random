import {useFieldStore} from "~/stores/current-field-store";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "~/components/ui/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import {Input} from "~/components/ui/input";
import {Label} from "~/components/ui/label";
import {useValidationStore} from "~/stores/validation-store";
import {useState} from "react";
import {createId} from "@paralleldrive/cuid2";
import {Button} from "~/components/ui/button";
import {useHotkeys} from "react-hotkeys-hook";


type DialogProps = {
    open: boolean,
    setOpen: (value: boolean) => void
}
export const AddValidationDialog = ({open, setOpen}: DialogProps) => {
    const fieldStore = useFieldStore()
    const validationStore = useValidationStore()
    const [name, setName] = useState("")
    const [fieldId, setFieldId] = useState("")
    const [type, setType] = useState<"MISSING" | "INVALID">("MISSING")
    const [showNameError, setShowNameError] = useState(false)
    const [showFieldError, setShowFieldError] = useState(false)
    useHotkeys<HTMLDivElement>("ctrl+enter", () => {
        console.log("LOL")
        onSubmit();
    }, {preventDefault: true, enableOnFormTags: true})


    const resetStates = () => {
        setFieldId("")
        setName("")
    }

    const onSubmit = () => {
        if (name.length < 1) {
            setShowNameError(true)
            return
        } else {
            setShowNameError(false)
        }
        if (!fieldStore.fields.find(field => field.id === fieldId)) {
            setShowFieldError(true)
            return
        } else {
            setShowFieldError(false)
        }
        validationStore.addValidation({
            name,
            fieldId,
            id: createId(),
            type
        })
        resetStates()
        setOpen(false)
    }
    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add validation rule</DialogTitle>
                <DialogDescription>
                    Add a data validation rule to test your app's validation logic.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={(event) => {
                event.preventDefault();
                onSubmit()
            }} className={"space-y-4"}>
                <div className={"grid gap-2"}>
                    <Label>Validation rule name</Label>
                    <Input onChange={event => setName(event.target.value)}
                           placeholder={"Validation rule name"}/>
                    {showNameError &&
                        <p className={"text-red-600 text-xs"}>Please enter a name for your validation rule.</p>}
                </div>
                <div className={"grid gap-2"}>
                    <Label>Validation field</Label>
                    <Select value={fieldId} onValueChange={setFieldId}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Select field to validate..."/>
                        </SelectTrigger>
                        <SelectContent>
                            {fieldStore.fields.map(field => (
                                <SelectItem key={field.id} value={field.id}>{field.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {showFieldError && <p className={"text-red-600 text-xs"}>Please select a field to validate.</p>}
                </div>
                <div className={"grid gap-2"}>
                    <Label>Validation type</Label>
                    <Select value={type}
                            onValueChange={(value: "MISSING" | "INVALID") => setType(value)}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Select a validation type"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"MISSING"}>Missing data</SelectItem>
                            <SelectItem value={"INVALID"}>Invalid data (types)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Button>Add rule</Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>

}