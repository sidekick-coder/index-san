import { ipcRenderer, contextBridge } from 'electron'
import FSDrive from './gateways/fs-drive'

// import ListWorkspaces from '../../core/use-cases/list-workspaces/list-workspaces'
// import WorkspaceRepository from './repositories/workspace-repository'

// const workspaceRepository = new WorkspaceRepository()

const drive = new FSDrive()

drive.list('C:\\Users\\Work\\Desktop\\Workspace')

interface IUseCase {
    execute(args:any): Promise<any>
}

const options: Record<string, IUseCase> = {}

async function useCase(name: string, args: any) {
    const option = options[name]

    if (!option) return

    return await option.execute(args)
}

contextBridge.exposeInMainWorld('useCase', useCase)