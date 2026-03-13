import { Declare, Command, Options } from 'seyfert';
import { AchievementsCommand } from './fun.achievements';
import { CaptchaCommand } from './fun.captcha';

@Declare({
    name: "diversión",
    description: "Comandos de diversión",
})
@Options([
    AchievementsCommand,
    CaptchaCommand
])
export default class FunParent extends Command {}