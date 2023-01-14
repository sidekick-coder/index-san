/**
 * This scrit list all files in root of workspace
 */

const entries = await Drive.list('/')


setResult(entries)

