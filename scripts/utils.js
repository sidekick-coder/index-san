const { exec } = require('child_process')

exports.command = (arg, options) => {
    return new Promise((resolve, reject) => {
        const child = exec(arg)

        const result = {
            stderr: '',
            stdout: '',
        }

        child.stdout.on('data', (data) => {
            result.stdout = data
        })

        child.on('error', reject)

        child.on('close', () => resolve(result.stdout))

        if (options?.stdout) {
            child.stdout.pipe(process.stdout)
        }

        if (options?.stderr) {
            child.stdout.pipe(process.stderr)
        }
    })
}
