import { readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import type { Ora } from 'ora'

export function getProjectDirectory(projectName: string): string {
    return path.resolve(process.cwd(), projectName)
}

export function handleExistingProjectDirectory(
    projectDirectory: string,
    spinner: Ora,
): void {
    spinner.fail()
    throw new Error(`Project directory ${projectDirectory} already exists`)
}

async function replaceInFile(
    filePath: string,
    searchValue: string | RegExp,
    replaceValue: string,
): Promise<void> {
    const file = await readFile(filePath, 'utf8')
    const replacedFile = file.replace(searchValue, replaceValue)
    await writeFile(filePath, replacedFile, 'utf8')
}

export async function replaceInTemplateFiles(
    defaultProjectName: string,
    projectDirectory: string,
    projectName: string,
): Promise<void> {
    await Promise.all([
        // Reset version to 0.0.0
        replaceInFile(
            path.join(projectDirectory, 'package.json'),
            /(?<="version": ")\d+\.\d+\.\d+(?=")/,
            '0.0.0',
        ),
        replaceInFile(
            path.join(projectDirectory, 'README.md'),
            /[^]*/,
            `# ${projectName}\n
Created using [nodejs-api](https://github.com/samialdury/nodejs-api) template by [samialdury](https://github.com/samialdury).\n`,
        ),
    ])

    if (projectName !== defaultProjectName) {
        await Promise.all([
            replaceInFile(
                path.join(projectDirectory, 'package.json'),
                defaultProjectName,
                projectName,
            ),
            replaceInFile(
                path.join(projectDirectory, '.dev.env'),
                defaultProjectName,
                projectName,
            ),
            replaceInFile(
                path.join(projectDirectory, '.test.env'),
                defaultProjectName,
                projectName,
            ),
            replaceInFile(
                path.join(projectDirectory, 'Dockerfile'),
                defaultProjectName,
                projectName,
            ),
        ])
    }
}

export async function removeFile(filePath: string): Promise<void> {
    return rm(filePath, { force: true })
}
