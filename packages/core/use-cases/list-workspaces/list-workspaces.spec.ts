import { test } from "@japa/runner";
import Workspace from "../../entities/workspace";
import WorkspaceRepository from "../../repositories/workspace-repository";
import ListWorkspaces from "./list-workspaces";

const repository: WorkspaceRepository = {
    index: () => Promise.resolve([]),
}

test.group("list-workspaces use-case", () => {
    test('should return a list of workspaces', async ({ expect }) => {
        const workspace = new Workspace({
            name: 'test',
            path: 'test',
            drive: 'local',
        })

        repository.index = () => Promise.resolve([workspace])

        const useCase = new ListWorkspaces(repository);

        const result = await useCase.execute({});

        expect(result.data).toEqual([workspace])
    })
})