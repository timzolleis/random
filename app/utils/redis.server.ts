import Redis from "ioredis";

export const singleton = <Value>(name: string, valueFactory: () => Value): Value => {
    const g = global as any;
    g.__singletons ??= {};
    g.__singletons[name] ??= valueFactory();
    return g.__singletons[name];
};
// Hard-code a unique key, so we can look up the client when this module gets re-imported
const url = process.env.UPSTASH_URL;
if (!url) throw new Error('Missing UPSTASH_URL env variable');
const redis = singleton('redis', () => new Redis(url));

export {redis};
