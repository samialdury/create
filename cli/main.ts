#!/usr/bin/env node

// import path from 'node:path'

import { pathExists } from 'fs-extra/esm'
import color from 'picocolors'

import { isCmdAvailable, runInstall, runPrepareScript } from './cmds.js'
import { getProjectDirectory, handleExistingProjectDirectory } from './files.js'
import { cloneRepo } from './git.js'
import { finishSpinner, printNextSteps, startSpinner } from './output.js'
import { promptForProjectName } from './prompts.js'

// import color from 'picocolors'

// import { isCmdAvailable, runFormatAndLint, runInstall } from './cmds.js'
// import {
//     getProjectDirectory,
//     replaceInTemplateFiles,
//     handleExistingProjectDirectory,
//     removeFile,
// } from './files.js'
// import { cloneRepo } from './git.js'
// import { finishSpinner, printNextSteps, startSpinner } from './output.js'
// import { promptForProjectName } from './prompts.js'

type KeysOfMap<T> = T extends Map<infer K, unknown> ? K : never

const TEMPLATES = new Map([
    ['nodejs-api', 'samialdury/nodejs-api'],
    // ['nodejs-project', 'samialdury/nodejs-project'],
] as const)

function getValidTemplates(): string {
    return [...TEMPLATES.keys()].join('\n- ')
}

async function main(): Promise<void> {
    const template = process.argv[2] as KeysOfMap<typeof TEMPLATES> | undefined
    if (!template) {
        console.error(
            `Please specify a template.\nValid templates are:\n- ${getValidTemplates()}`,
        )
        process.exit(1)
    }

    const templateRepo = TEMPLATES.get(template)
    if (!templateRepo) {
        console.error(
            `Template \`${template}\` not found.\nValid templates are:\n  - ${getValidTemplates()}`,
        )
        process.exit(1)
    }

    const projectName =
        process.argv[3] ?? (await promptForProjectName(template))

    const bunAvailable = await isCmdAvailable('bun')
    if (!bunAvailable) {
        console.error(
            '`bun` is not installed. Please install it and try again.',
        )
        process.exit(1)
    }

    console.log(`Creating project ${projectName} from template ${template}`)

    const projectDirectory = getProjectDirectory(projectName)
    const spinner = startSpinner(
        `Checking directory ${color.cyan(projectDirectory)}...\n`,
    )
    const projectDirectoryExists = await pathExists(projectDirectory)
    if (projectDirectoryExists) {
        handleExistingProjectDirectory(projectDirectory, spinner)
    }
    finishSpinner(spinner, color.green('Directory available'))

    const cloneSpinner = startSpinner(`Cloning template...\n`)
    await cloneRepo(templateRepo, projectDirectory)
    finishSpinner(cloneSpinner, color.green(color.green('Template cloned')))

    const installSpinner = startSpinner(
        'Installing dependencies (this may take a while)...\n',
    )
    await runInstall(projectDirectory)
    finishSpinner(installSpinner, color.green('Dependencies installed'))

    const templateSpinner = startSpinner('Setting up template...\n')
    await runPrepareScript(projectDirectory, projectName)
    finishSpinner(templateSpinner, color.green('Template ready'))

    finishSpinner(
        spinner,
        color.green(
            `Project ${color.cyan(projectName)} created in ${color.cyan(
                projectDirectory,
            )}`,
        ),
    )
    printNextSteps(projectName)
}

await main()
