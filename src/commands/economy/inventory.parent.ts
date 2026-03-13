import { Declare, Command, Options } from 'seyfert';
import { InventoryViewCommand } from './inventory.view';
import { InventoryCustomizeCommand } from './inventory.customize';
import { InventoryRemoveCommand } from './inventory.remove';

@Declare({
    name: "inventario",
    description: "Gestiona tus objetos personales",
})
@Options([InventoryViewCommand, InventoryCustomizeCommand, InventoryRemoveCommand])
export default class InventoryParent extends Command {}
