#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { KeysOfMap } from './types.js'
import packageJson from '../package.json'
import {
    isCmdAvailable,
    runInstall,
    runPostInstall,
    runPrepareScript,
} from './cmds.js'
import {
    CreateError,
    isCreateError,
    isInquirerError,
    isUnknownError,
} from './errors.js'
import {
    checkIfFileExists,
    getProjectDirectory,
    handleExistingProjectDirectory,
} from './files.js'
import { cloneRepo } from './git.js'
import {
    color,
    finishSpinner,
    printHelp,
    printNextSteps,
    printVersion,
    startSpinner,
} from './output.js'
import { promptForProjectName, promptForTemplateName } from './prompts.js'

const BASE_URL = 'https://github.com'
const ISSUE_PATH = '/issues/new'

const PACKAGE_NAME = packageJson.name
const VERSION = packageJson.version
const AUTHOR = packageJson.author

const PROJECT_REPO_URL = `${BASE_URL}/samialdury/create`
const ISSUE_URL = `${PROJECT_REPO_URL}${ISSUE_PATH}`

const TEMPLATES = new Map([
    [
        'nodejs-api',
        {
            description: 'Node.js API template',
            repository: `${BASE_URL}/samialdury/nodejs-api`,
        },
    ],
    [
        'nodejs-project',
        {
            description: 'Node.js project template',
            repository: `${BASE_URL}/samialdury/nodejs-project`,
        },
    ],
    [
        'nextjs-project',
        {
            description: 'Next.js project template',
            repository: `${BASE_URL}/samialdury/nextjs-project`,
        },
    ],
] as const)

function getValidTemplates(): string {
    return [...TEMPLATES.keys()].join('\n  - ')
}

async function main(): Promise<void> {
    if (['--help', '-h', 'help'].includes(process.argv.at(2)!)) {
        printHelp(PACKAGE_NAME, TEMPLATES, AUTHOR, VERSION)
        process.exit(0)
    } else if (['--version', '-v', 'version'].includes(process.argv.at(2)!)) {
        printVersion(VERSION)
        process.exit(0)
    }

    const gitAvailable = await isCmdAvailable('git')
    if (!gitAvailable) {
        throw new CreateError(
            '`git` is not installed. Please install it and try again.',
        )
    }
    const templateArgument = process.argv[2]

    if (templateArgument && !TEMPLATES.get(templateArgument as never)) {
        throw new CreateError(
            `Template \`${templateArgument}\` not found.\n` +
                color.reset(`Valid templates are:\n  - ${getValidTemplates()}`),
        )
    }

    const projectNameArgument = process.argv[3]

    const template = (templateArgument ??
        (await promptForTemplateName(TEMPLATES))) as KeysOfMap<typeof TEMPLATES>

    const templateRepo = TEMPLATES.get(template)!.repository

    let projectName =
        projectNameArgument ?? (await promptForProjectName(template))

    const relativeDirectory = projectName

    // If the user specified a subdirectory,
    // use only the last part as the project name
    projectName = projectName.split('/').at(-1) ?? projectName

    console.log(
        color.cyan(
            `Creating project \`${projectName}\` from template \`${template}\`...\n`,
        ),
    )

    const projectDirectory = getProjectDirectory(relativeDirectory)
    const directoryCheckSpinner = startSpinner(
        `Checking directory ${color.cyan(projectDirectory)}...\n`,
    )
    const projectDirectoryExists = await checkIfFileExists(projectDirectory)
    if (projectDirectoryExists) {
        handleExistingProjectDirectory(projectDirectory, directoryCheckSpinner)
    }
    finishSpinner(directoryCheckSpinner, color.green('Directory available'))

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
    await runPostInstall(projectDirectory, PACKAGE_NAME)
    finishSpinner(templateSpinner, color.green('Template ready'))

    finishSpinner(
        directoryCheckSpinner,
        color.green(
            `Project ${color.cyan(projectName)} created in ${color.cyan(
                projectDirectory,
            )}`,
        ),
    )
    printNextSteps(relativeDirectory)
}

try {
    await main()
} catch (err) {
    if (isCreateError(err)) {
        console.error(color.red(err.message + '\n'))
        process.exit(err.exitCode)
    }

    if (isInquirerError(err)) {
        console.error(color.yellow('Cancelled' + '\n'))
        process.exit(0)
    }

    if (isUnknownError(err)) {
        console.error(color.red(err.message) + '\n')
        console.error(
            color.yellow(
                `An unexpected error occurred. Please open an issue on GitHub:\n` +
                    color.cyan(`${ISSUE_URL}\n`),
            ),
        )
        process.exit(1)
    }

    process.exit(1)
}
