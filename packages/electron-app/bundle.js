/**
 * @typedef {{
 *   new (options: { path: string }): {
 *     loadActual(): Promise<Node>
 *   }
 * }} Arborist
 */

const fs = require('fs/promises')
const path = require('path')
/** @type {Arborist} */
const arborist = require('@npmcli/arborist')
const { findRoot } = require('@manypkg/find-root')

/**
 * @typedef {{
 *  workspace: boolean;
 *  type: 'prod' | 'dev' | 'peer' | 'optional'
 *  to: Node;
 * }} Edge
 */

/**
 * @typedef {{
 *  isLink: boolean;
 *  location: string;
 *  realpath: string;
 *  target: Node;
 *  edgesOut: Map<string, Edge>;
 * }} Node
 */

/** @type {(node: Node) => Node} */
const resolveLink = (node) => (node.isLink ? resolveLink(node.target) : node)

/** @type {(node: Node, realPath: string) => Node | undefined} */
const getWorkspaceByPath = (node, realPath) =>
    [...node.edgesOut.values()]
        .filter((depEdge) => depEdge.workspace)
        .map((depEdge) => resolveLink(depEdge.to))
        .find((depNode) => depNode.realpath === realPath)

/** @type {(node: Node) => Node[]} */
const collectProdDeps = (node) =>
    [...node.edgesOut.values()]
        .filter((depEdge) => depEdge.type === 'prod')
        .map((depEdge) => resolveLink(depEdge.to))
        .flatMap((depNode) => [depNode, ...collectProdDeps(depNode)])

/** @type {(source: string, destination: string) => Promise<void>} */
const bundle = async (source, destination) => {
    const root = await findRoot(source)
    const rootNode = await new arborist({ path: root }).loadActual()
    const sourceNode = getWorkspaceByPath(rootNode, source)

    if (!sourceNode) {
        throw new Error('could not find source node')
    }

    const prodDeps = collectProdDeps(sourceNode)

    for (const dep of prodDeps) {
        const dest = path.join(destination, dep.location)

        await fs.cp(dep.realpath, dest, {
            recursive: true,
            errorOnExist: false,
        })
    }
}

module.exports = { bundle }
