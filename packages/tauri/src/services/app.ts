import AppConfig from '@core/config/app'
import App from '@core/app'

import WorkspaceRepository from './workspace-repository'
import ServiceEvaluation from '@core/gateways/evaluation/implementations/default-evaluation'

import FSDrive from './drive'

const workspaceRepository = new WorkspaceRepository()

const config = new AppConfig({
    repositories: { workspace: workspaceRepository },
    drives: { fs: new FSDrive() },
    services: { evaluation: new ServiceEvaluation() },
})

export default new App(config)
