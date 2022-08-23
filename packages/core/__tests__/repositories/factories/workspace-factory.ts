import Workspace from "../../../entities/workspace";
import { Factory } from "./base";

const WorkspaceFactory = new Factory<Workspace>(() => (new Workspace({
    name: 'fake',
    drive: 'local',
    path: '/my-workspace',
    config: {}
})))

export default WorkspaceFactory