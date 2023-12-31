import type { Ora } from 'ora'
import { access } from 'node:fs/promises'
import path from 'node:path'
import { CreateError } from './errors.js'

export function getProjectDirectory(projectName: string): string {
    return path.resolve(process.cwd(), projectName)
}

export function handleExistingProjectDirectory(
    projectDirectory: string,
    spinner: Ora,
): void {
    spinner.fail()
    throw new CreateError(
        `Project directory ${projectDirectory} already exists. Please remove it and try again.`,
    )
}

export async function checkIfFileExists(filePath: string): Promise<boolean> {
    try {
        await access(filePath)
        return true
    } catch {
        return false
    }
}
