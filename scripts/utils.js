const { spawn } = require('child_process')

exports.command = (param, options) => {
    return new Promise((resolve, reject) => {
        const [command, ...args] = param.split(' ')

        const child = spawn(command, args, {
            shell: true,
            stdio: 'inherit',
        })

        child.on('exit', (error) => {
            if (error) reject()

            if (!error) resolve()
        })
    })
}
