import { Declare, Command, Options } from 'seyfert';
import { StoreViewCommand } from './store.view';
import { StoreBuyCommand } from './store.buy';
import { StoreAddCommand } from './store.add';
import { StoreRemoveCommand } from './store.remove';
import { StoreEditCommand } from './store.edit';

@Declare({
    name: "tienda",
    description: "Sistema de tienda del bot",
})
@Options([StoreViewCommand, StoreBuyCommand, StoreAddCommand, StoreRemoveCommand, StoreEditCommand])
export default class StoreParent extends Command {}
