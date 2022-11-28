import vm from 'vm'
import lodash from 'lodash'

import ExecuteScriptDTO from './execute-script.dto'
import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'

interface ScriptSandbox {
    main: (workspace: WorkspaceService) => Promise<string>
    [key: string]: any
}

export default class ExecuteScript {
    constructor(private readonly app: AppService) {}

    public executeScript(content: string, workspace: WorkspaceService) {
        return new Promise<string>((resolve) => {
            const lines: string[] = []

            try {
                const script: ScriptSandbox = {
                    main: () => Promise.reject('Error executing script'),
                    $lodash: lodash,
                    console: {
                        log: (...args: string[]) => lines.push(args.join(' ')),
                    },
                }

                const executable = new vm.Script(content.toString())
                const context = vm.createContext(script)

                executable.runInContext(context, {})

                script
                    .main(workspace)
                    .then((r) => {
                        lines.push(r)

                        resolve(lines.join('\n'))
                    })
                    .catch((error) => {
                        lines.push(error.message || 'Error executing script')
                        resolve(lines.join('\n'))
                    })
            } catch (error: any) {
                lines.push(error.message || 'Error executing script')

                resolve(lines.join('\n'))
            }
        })
    }

    public async execute({
        workspaceId,
        name,
    }: ExecuteScriptDTO.Input): Promise<ExecuteScriptDTO.Output> {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const filename = `.is/scripts/${name}.js`

        const content = await workspace.drive.read(filename)

        if (!content) {
            throw new Error('Script not found')
        }

        const output = await this.executeScript(content.toString(), workspace)

        return {
            data: output,
        }
    }
}
