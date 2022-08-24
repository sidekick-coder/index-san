import Workspace from "../../entities/workspace";
import { Factory } from "./base";

const WorkspaceFactory = new Factory<Workspace>((data) => (new Workspace({
    name: 'fake',
    drive: 'local',
    path: '/my-workspace',
    config: {},
    ...data
})))

export default WorkspaceFactory