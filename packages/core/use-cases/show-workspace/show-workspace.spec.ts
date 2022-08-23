import { test } from "@japa/runner";
import Workspace from "../../entities/workspace";
import WorkspaceFactory from "../../__tests__/repositories/factories/workspace-factory";
import InMemoryWorkspaceRepository from "../../__tests__/repositories/in-memory-workspace-repository";
import ShowWorkspace from "./show-workspace";

test.group('show-workspace (use-case)', (group) => {

    const repository = new InMemoryWorkspaceRepository()
    const useCase = new ShowWorkspace(repository)

    group.teardown(() => repository.clear())

    test('should return a workspace', async ({ expect }) => {

        const workspace = WorkspaceFactory.create()

        await repository.create(workspace)
        
        const result = await useCase.execute({
            id: workspace.id
        })

        expect(result).toEqual(workspace)
    })

    test('should throw an error if workspace was not found', async ({ expect }) => {

        expect.assertions(1)
        
        await useCase.execute({ id: '999' }).catch(err => {
            expect(err.message).toEqual('Workspace not found')
        })

    })

})