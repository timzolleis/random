import {useState} from "react";
import {Button} from "~/components/ui/button";

type Field = {
    name: string,
    type: string,
}

const ShortcutHint = ({shortcut}: { shortcut: string }) => (
    <span className="w-5 h-5 inline-flex bg-primary text-white justify-center items-center p-2 text-xs rounded shadow">
        {shortcut}
    </span>
)



export const AddFields = () => {
    const [fields, setFields] = useState<Field[]>([])


    return (
        <div className="flex flex-col justify-center text-center md:flex-row md:text-left">
            <div className="flex flex-col justify-center p-10 space-y-12">
                <article>
                      <span className="inline-flex items-center text-black rounded-xl">
                        <span className="font-mono text-sm" aria-hidden="true">
                          01
                        </span>
                      </span>
                    <div className="mt-3 text-3xl tracking-tighter text-black">
                        Add fields
                    </div>
                    <div className="mt-2 text-gray-500">
                        Add fields to your dataset. Drag to reorder
                    </div>
                    <div className={"flex flex-wrap items-center gap-2 mt-3"}>
                        <Button size={"sm"}
                                className={"rounded-full bg-transparent text-primary border-primary border-dotted shadow-none border hover:bg-transparent"}>
                            <ShortcutHint shortcut={"⌘"}/>
                            Add
                            field</Button>
                    </div>
                </article>


                <article>
                      <span className="inline-flex items-center text-black rounded-xl">
                        <span className="font-mono text-sm" aria-hidden="true">
                          02
                        </span>
                      </span>
                    <div className="mt-3 text-3xl tracking-tighter text-black">
                        Include corrupt data
                    </div>
                    <div className="mt-4 text-gray-500">
                        You can include corrupt data to test your application's error handling
                    </div>
                </article>
                {/*<article>*/}
                {/*  <span className="inline-flex items-center text-black rounded-xl">*/}
                {/*    <span className="font-mono text-sm" aria-hidden="true">*/}
                {/*      03*/}
                {/*    </span>*/}
                {/*  </span>*/}
                {/*    <div className="mt-3 text-3xl tracking-tighter text-black">*/}
                {/*        */}
                {/*    </div>*/}
                {/*    <div className="mt-4 text-gray-500">*/}
                {/*        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam*/}
                {/*        facilis, voluptates error alias dolorem praesentium sit soluta iure*/}
                {/*        incidunt labore explicabo eaque, quia architecto veritatis dolores,*/}
                {/*        enim consequatur nihil ipsum.*/}
                {/*    </div>*/}
                {/*</article>*/}
            </div>
        </div>
    )
}