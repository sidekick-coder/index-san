declare namespace ShowWorkspaceOptionsDTO {
    export interface Input {
        workspaceId: string
    }

    export type Output = {
        data: Record<string, any>
    }
}

export default ShowWorkspaceOptionsDTO
