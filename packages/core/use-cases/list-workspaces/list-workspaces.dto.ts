interface DataItem {
    id: string;
    name: string;
    path: string;
    drive: string;
}

export interface ListWorkspacesInput { }

export interface ListWorkspacesOutput {
    data: DataItem[]
}