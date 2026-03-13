import cooldown from "./plugins/middleware.cooldown";
import onlyDev from "./plugins/middleware.onlydev";
import onlyAdmin from "./plugins/middleware.onlyadmin";

export const middlewares = {
    cooldown,
    onlyDev,
    onlyAdmin
}