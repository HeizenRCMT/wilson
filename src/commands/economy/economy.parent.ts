import {  Declare, Command, Options } from 'seyfert';
import { BalanceCommand } from './bank.balance';
import { WorkCommand } from './economy.work';
import { BankDepositCommand } from './bank.deposit';
import { BankWithdrawCommand } from './bank.withdraw';
import { RobCommand } from './economy.rob';
import { SlutCommand } from './economy.slut';
import { LeaderboardCommand } from './economy.ranking';

@Declare({
    name: "economía",
    description: "Comandos de economía",
})
@Options([
    BalanceCommand, 
    WorkCommand, 
    BankDepositCommand, 
    BankWithdrawCommand, 
    RobCommand, 
    SlutCommand,
    LeaderboardCommand
])
export default class EconomyParent extends Command {}