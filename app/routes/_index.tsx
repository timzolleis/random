import type {MetaFunction} from "@remix-run/node";
import {Link} from "@remix-run/react";
import {Button} from "~/components/ui/button";

export const meta: MetaFunction = () => {
    return [
        {title: "New Remix App"},
        {name: "description", content: "Welcome to Remix!"},
    ];
};

export default function Index() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold font-inter tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                            Generate random data. Fast.
                        </h1>
                        <p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400">
                            Generate vast amounts of random data in a variety of formats using a beautiful and intuitive
                            interface.
                        </p>
                    </div>
                    <Button className={"rounded-full"}
                    >
                       Start generating
                    </Button>
                </div>
            </div>
        </section>
    );
}
