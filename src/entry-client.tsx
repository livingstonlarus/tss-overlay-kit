import { hydrate } from 'solid-js/web'
import { StartClient, hydrateStart } from '@tanstack/solid-start/client'

hydrateStart().then((router: any) => {
    hydrate(() => {
        return <StartClient router={router} />;
    }, document);
});
