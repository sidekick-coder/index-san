export async function createCommitFromPath(path: string) {
    const { app } = useChrono()

    // ignore crono folder
    if (path.includes('.chrono')) {
        return
    }

    let status = await app.status()

    const isUntracked = status.untracked.includes(path)

    await app.addEntry(path)

    status = await app.status()

    if (!status.added.length) {
        console.debug('[chrono] no changes to commit')
        return
    }

    const commit = await app.commit({
        message: isUntracked ? `Add ${path}` : `Update ${path}`,
    })

    console.debug('[chrono] create commit', commit)

    return commit
}