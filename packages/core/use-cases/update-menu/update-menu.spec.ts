import { test } from '@japa/runner'
import Menu from '../../entities/menu'

import InMemoryApp from '../../__tests__/app'
import InMemoryAppConfig from '../../__tests__/in-memory-config'
import UpdateMenu from './update-menu'

test.group('update-menu (use-case)', (group) => {
    const app = new InMemoryAppConfig()
    const useCase = new UpdateMenu(app)

    group.each.teardown(() => app.clear())

    test('should update menu', async ({ expect }) => {
        const workspace = app.workspaceRepository.createFakeSync()

        app.drive.createFile('.is/menu.json', [
            {
                label: 'item-initial',
                to: 'item-initial',
            },
        ])

        const payload = new Menu({
            to: 'item-update',
            icon: '',
            label: 'item-update',
            children: [],
        })

        await useCase.execute({
            workspaceId: workspace.id,
            data: [payload],
        })

        const menu = await app.drive.readArray('.is/menu.json')

        expect(menu[0]).toEqual(payload)
    })
})
