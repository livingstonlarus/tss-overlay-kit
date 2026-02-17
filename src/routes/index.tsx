import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/')({
    component: Home,
})

function Home() {
    return (
        <div class="p-8">
            <h1 class="text-2xl font-bold mb-4">Welcome to your new TSS App!</h1>
            <p>Start editing to see some magic happen.</p>
        </div>
    )
}
