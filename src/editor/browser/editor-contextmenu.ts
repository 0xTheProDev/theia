import { injectable, inject } from "inversify";
import { ContextMenuRenderer } from "../../application/browser/menu/context-menu-renderer";
import IContextMenuService = monaco.editor.IContextMenuService;
import IContextMenuDelegate = monaco.editor.IContextMenuDelegate;
import CommandsRegistry = monaco.commands.CommandsRegistry;
import MenuRegistry = monaco.actions.MenuRegistry;
import MenuId = monaco.actions.MenuId;

export const EditorContextMenuService = Symbol("EditorContextMenuService");

export interface EditorContextMenuService extends IContextMenuService {

}

@injectable()
export class BrowserContextMenuService implements EditorContextMenuService {

    constructor(@inject(ContextMenuRenderer) protected readonly contextMenuRenderer: ContextMenuRenderer) {
    }

    showContextMenu(delegate: IContextMenuDelegate): void {
        console.log(delegate.getAnchor());
        console.log(this.contextMenuRenderer);
        const ids = Object.keys(CommandsRegistry.getCommands());
        console.log(ids.length);

        const menuItems = MenuRegistry.getMenuItems(MenuId.EditorContext);
        menuItems.forEach(item => {
            if (!item.command) {
                console.log(`Menu item does not have a corresponding command: ${JSON.stringify(item)}.`);
            } else {
                const menuCommand = item.command;
                console.log(`Processing menu item with command: ${menuCommand.id}.`);
                const command = CommandsRegistry.getCommand(menuCommand.id);
                if (!command) {
                    console.log(`Cannot find command in registry with ID: ${menuCommand.id}.`);
                } else {
                    const handler = command.handler;
                    if (!handler) {
                        console.log(`Command '${menuCommand.id}' does not have a handler.`)
                    } else {
                        const desc = command.description;
                        console.log(`Menu item: ${menuCommand.id} with handler: ${handler} with when: ${item.when}.`);
                        console.log(`Command description was: ${JSON.stringify(desc)}.`);
                    }
                }
            }
            console.log();
        })
    }

}