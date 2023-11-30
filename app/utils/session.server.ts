import {createCookieSessionStorage} from '@remix-run/node';

const sessionSecret = process.env.APPLICATION_SECRET
if (!sessionSecret) throw new Error('Missing APPLICATION_SECRET env variable');

const generationStorage = createCookieSessionStorage({
    cookie: {
        name: 'random_session_storage',
        secure: true,
        secrets: [sessionSecret],
        sameSite: 'lax',
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
    },
});

async function getGenerationSession(request: Request) {
    const session = await generationStorage.getSession(request.headers.get('Cookie'));
    return {
        setLastGeneration(id: string) {
            session.set('lastGeneration', id);
            this.addGeneration(id);
        },
        getLastGeneration: () => session.get('lastGeneration'),
        getGenerations: () => session.get('generations'),
        addGeneration(id: string) {
            const generations = session.get('generations') || [];
            generations.push(id);
            session.set('generations', generations);
        },
        removeGeneration(id: string) {
            const generations = session.get('generations') || [];
            session.set('generations', generations.filter((generationId: string) => generationId !== id));
        },
        removeGenerations() {
            session.unset('generations');
        },
        commit() {
            return generationStorage.commitSession(session)
        }
    };

}

export {getGenerationSession};
