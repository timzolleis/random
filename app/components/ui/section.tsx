import {ReactNode} from "react";

export const SectionHeader = ({children}: { children: ReactNode }) => {

    return <div className="mt-3 text-3xl tracking-tighter text-black">
        {children}
    </div>
}

export const SectionNumber = ({children}: { children: ReactNode }) => {
    return <span className="inline-flex items-center text-black rounded-xl">
                        <span className="font-mono text-sm" aria-hidden="true">
                        {children}
                        </span>
                      </span>
}


export const SectionDescription = ({children}: { children: ReactNode }) => {
    return (
        <div className="mt-2 text-gray-500">
            {children}
        </div>
    )
}

export const SectionContainer = ({children}: { children: ReactNode }) => {
    return <div className="flex flex-col justify-center text-center md:flex-row md:text-left">
        <div className="flex flex-col justify-center p-10 space-y-12">
            {children}
        </div>
    </div>
}

export const Section = ({children}: { children: ReactNode }) => {
    return <article>
        {children}
    </article>
}