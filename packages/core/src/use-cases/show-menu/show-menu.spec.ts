import { test } from '@japa/runner'
import Menu from '../../entities/menu'

import InMemoryAppConfig from '../../__tests__/in-memory-config'
import ShowMenu from './show-menu'

test.group('show-menu (use-case)', (group) => {
    const app = new InMemoryAppConfig()
    const useCase = new ShowMenu(app)

    group.each.teardown(() => app.clear())

    test('should return list of menus', async ({ expect }) => {
        const menu: Menu[] = []

        const workspace = app.workspaceRepository.createFakeSync()

        for (let i = 0; i < 20; i++) {
            menu.push(
                new Menu({
                    children: [],
                    label: `item-${i}`,
                    to: `item-${i}`,
                })
            )
        }

        app.drive.createFile('.is/menu.json', menu)

        const result = await useCase.execute({
            workspaceId: workspace.id,
        })

        expect(result.data).toEqual(menu)
    })
})
