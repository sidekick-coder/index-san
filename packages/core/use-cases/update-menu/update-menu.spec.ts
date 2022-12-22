import { test } from '@japa/runner'
import Menu from '../../entities/menu'

import InMemoryApp from '../../__tests__/app'
import UpdateMenu from './update-menu'

test.group('update-menu (use-case)', (group) => {
    const app = new InMemoryApp()
    const useCase = new UpdateMenu(app)

    group.each.teardown(() => app.memoryDrive.clear())

    test('should update menu', async ({ expect }) => {
        const workspace = app.workspaceRepository.createFakeSync()

        app.memoryDrive.createFile(
            '.is/menu.json',
            JSON.stringify([
                {
                    label: 'item-initial',
                    to: 'item-initial',
                },
            ])
        )

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

        const menu = await app.memoryDrive.readArray('.is/menu.json')

        expect(menu[0]).toEqual(payload)
    })
})
