const { spawn } = require('child_process')

exports.command = (param, inherit = true) => {
    return new Promise((resolve, reject) => {
        const [command, ...args] = param.split(' ')

        const child = spawn(command, args, {
            shell: inherit,
            stdio: inherit ? 'inherit' : 'pipe',
        })

        let result

        if (!inherit) {
            child.stdout.on('data', (data) => {
                result = data.toString()
            })
        }

        child.on('error', reject)

        child.on('exit', (error) => {
            if (error) reject()

            if (!error) resolve(result)
        })
    })
}
