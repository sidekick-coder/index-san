import { cpSync } from 'fs'
import { resolve } from 'path'
import { build as tscBuild } from 'tsc-prog'
import execa from 'execa'

export class Builder {
    public paths = {
        dist: 'dist',
        public: 'public',
    }

    constructor(public appPath = resolve(__dirname, '..')){
        
        this.paths.dist = resolve(appPath, 'dist')
        this.paths.public = resolve(appPath, 'public')

    }

    vue(){
        return execa.sync('npm', ['run', 'vue:build']);    
    }

    tsc(){
        return tscBuild({
            basePath: this.appPath,
            configFilePath: resolve(this.appPath, 'tsconfig.json'),
            clean: { outDir: true },
        })
    }

    postBuild(){
        return cpSync(
            this.paths.public,
            resolve(this.paths.dist, 'public'), 
            { recursive: true }
        )
    }

    build(){
        console.time('Build-time')

        console.log('Building...')

        this.vue();

        this.tsc();

        this.postBuild();

        console.timeEnd('Build-time')

    }
}

if (require.main === module) {
    new Builder().build();
}