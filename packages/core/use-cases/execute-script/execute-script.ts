import vm from 'vm'
import util from 'util'

import ExecuteScriptDTO from './execute-script.dto'
import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'


interface ScriptSandbox {
    main: (workspace: WorkspaceService) => Promise<string>
}

export default class ExecuteScript {
    constructor(private readonly app: AppService){}

    public executeScript(content: string, workspace: WorkspaceService) {
        return new Promise<string>((resolve, reject) => {
            try {
                const script: ScriptSandbox = {
                    main: () => Promise.reject('Error executing script')
                }
                  
                const executable = new vm.Script(content.toString())
                const context = vm.createContext(script)
        
                executable.runInContext(context, {})

                script.main(workspace).then(resolve).catch(resolve)

                
            } catch (error: any) {
                resolve(error.message || 'Error executing script')
            }
        })
    }

    public async execute({ workspaceId, name }: ExecuteScriptDTO.Input): Promise<ExecuteScriptDTO.Output> {

        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const filename = `.is/scripts/${name}.js`
        
        const content = await workspace.drive.read(filename)
        
        if (!content) {
            throw new Error('Script not found')
        }

        const output = await this.executeScript(content.toString(), workspace)

        return {
            data: output
        }
    }
}