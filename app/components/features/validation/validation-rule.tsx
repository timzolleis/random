import {useValidationStore, Validation} from "~/stores/validation-store";
import {Badge} from "~/components/ui/badge";
import {useFieldStore} from "~/stores/current-field-store";
import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger} from "~/components/ui/context-menu";
import {useState} from "react";
import {useHotkeys} from "react-hotkeys-hook";

export const ValidationRuleComponent = ({validation}: { validation: Validation }) => {
    const [showMenu, setShowMenu] = useState(false)
    const fieldStore = useFieldStore();
    const validationStore = useValidationStore();
    const field = fieldStore.fields.find(field => field.id === validation.fieldId)
    useHotkeys("x", () => {
        showMenu && validationStore.removeValidation(validation.id)
    }, {
        preventDefault: true
    })

    return (
        <ContextMenu onOpenChange={setShowMenu}>
            <ContextMenuTrigger asChild={true}>
                <div className={"p-3 rounded-md border shadow space-y-2"}>
                    <p className={"font-medium text-sm"}>{validation.name}</p>
                    <div className={"flex items-center gap-2"}>
                        <Badge className={"text-xs"}>{field?.name}</Badge>
                        <Badge className={"text-xs"}
                               variant={"outline"}>{validation.type}</Badge>
                    </div>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem className={"flex items-center gap-2 justify-between text-red-600"}
                                 onClick={() => validationStore.removeValidation(validation.id)}>
                    <p className={" hover:text-red-700 font-medium"}>Remove</p>
                    <kbd
                        className="hover:text-red-700 hidden rounded bg-red-100 px-2 py-0.5 text-xs font-light  transition-all duration-75 group-hover:bg-red-500 group-hover:text-white sm:inline-block">
                        X
                    </kbd>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
