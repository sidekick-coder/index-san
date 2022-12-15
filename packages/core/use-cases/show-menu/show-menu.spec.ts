import { test } from '@japa/runner'
import Menu from '../../entities/menu'

import InMemoryApp from '../../__tests__/app'
import ShowMenu from './show-menu'

test.group('show-menu (use-case)', (group) => {
    const app = new InMemoryApp()
    const useCase = new ShowMenu(app)

    group.each.teardown(() => app.memoryDrive.clear())

    test('should return list of menus', async ({ expect }) => {
        const menu: Menu[] = []

        const workspace = app.workspaceRepository.createFakeSync()

        for (let i = 0; i < 20; i++) {
            menu.push({
                id: String(i),
                label: `item-${i}`,
                to: `item-${i}`,
            })
        }

        app.memoryDrive.createFile('.is/menu.json', JSON.stringify(menu))

        const result = await useCase.execute({
            workspaceId: workspace.id,
        })

        expect(result.data).toEqual(menu)
    })
})
