import { Button as KButton } from "@kobalte/core/button";
import { splitProps, type ValidComponent } from "solid-js";
import { cn } from "../../lib/utils";

// Example of a reusable Button component wrapping Kobalte's primitive
export function Button(props: KButton.ButtonRootProps) {
    const [local, others] = splitProps(props, ["class", "children"]);

    return (
        <KButton.Root
            class={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-none text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                "bg-dashboard-base text-content-main hover:bg-dashboard-slot/90 border border-din-border h-10 px-4 py-2",
                local.class
            )}
            {...others}
        >
            {local.children}
        </KButton.Root>
    );
}
