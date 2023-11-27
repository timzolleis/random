import type {MetaFunction} from "@remix-run/node";
import {AddFields} from "~/components/features/AddFields";

export const meta: MetaFunction = () => {
    return [
        {title: "New Remix App"},
        {name: "description", content: "Welcome to Remix!"},
    ];
};
export default function Index() {
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
                        <AddFields/>
                    </div>

                </div>
            </div>
        </section>
    );
}
