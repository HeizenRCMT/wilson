import { createMiddleware } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

export default createMiddleware((middle) => {
    if (middle.context.author.id !== "709770108863643649") {
        middle.context.write({
            content: "No eres desarollador",
            flags: MessageFlags.Ephemeral
        })
        return middle.stop("");
    }
    middle.next("")
})