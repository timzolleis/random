import {Field} from "~/types/field";
import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger,} from "~/components/ui/context-menu"
import {useFieldStore} from "~/stores/current-field-store";
import {useHotkeys} from "react-hotkeys-hook";
import {useEffect, useState} from "react";
import {useMotionValue} from "framer-motion";

export const FieldComponent = ({field}: { field: Field }) => {
    const fieldStore = useFieldStore()
    const [showMenu, setShowMenu] = useState(false)
    useHotkeys<HTMLDivElement>("x", () => {
        if(showMenu){
            console.log("Removing")
            showMenu && fieldStore.removeField(field)
        }
    }, {preventDefault: true})
    return <ContextMenu onOpenChange={setShowMenu}>
        <ContextMenuTrigger asChild={true}>
            <div
                className={"rounded-full bg-primary border-primary inline-flex items-center text-primary-foreground h-8 px-3 text-xs shadow-none border"}>{field.name}</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
            <ContextMenuItem className={"flex items-center gap-2 justify-between text-red-600"}
                             onClick={() => fieldStore.removeField(field)}>
                <p className={" hover:text-red-700 font-medium"}>Remove</p>
                <kbd
                    className="hover:text-red-700 hidden rounded bg-red-100 px-2 py-0.5 text-xs font-light  transition-all duration-75 group-hover:bg-red-500 group-hover:text-white sm:inline-block">
                    X
                </kbd>
            </ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>
}