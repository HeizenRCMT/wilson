import { createMiddleware } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

export default createMiddleware(async (middle) => {
    const member = await middle.context.member?.fetchPermissions()
    if (!member?.has(["Administrator"]) || middle.context.author.id !== "709770108863643649") {
        middle.context.write({
            content: "No eres administrador",
            flags: MessageFlags.Ephemeral
        })
        return middle.stop("");
    }
    middle.next("")
})