import {useStepStore} from "~/stores/step-store";
import {SectionNumber} from "~/components/ui/section";
import {MoveLeft, MoveRight} from "lucide-react";

export const StepSelector = () => {
    const stepStore = useStepStore()
    return <div className={"px-3 py-1 flex items-center gap-2 text-muted-foreground"}>
        <SectionNumber>{stepStore.step}/2</SectionNumber>
        <div className={"hover:cursor-pointer"}>
            {stepStore.step === 1 && <MoveRight onClick={() => stepStore.increment()}/>}
            {stepStore.step === 2 && <MoveLeft onClick={() => stepStore.decrement()}/>}
        </div>
    </div>
}
