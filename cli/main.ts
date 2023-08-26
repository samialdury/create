#!/usr/bin/env node

import path from 'node:path'

import chalk from 'chalk'
import { pathExists } from 'fs-extra/esm'

import { isCmdAvailable, runFormatAndLint, runInstall } from './cmds.js'
import {
    getProjectDirectory,
    replaceInTemplateFiles,
    handleExistingProjectDirectory,
    removeFile,
} from './files.js'
import { cloneRepo } from './git.js'
import { finishSpinner, printNextSteps, startSpinner } from './output.js'
import { promptForProjectName } from './prompts.js'

const DEFAULT_PROJECT_NAME = 'nodejs-project'
const TEMPLATE_REPO = 'samialdury/nodejs-project'

async function main(): Promise<void> {
    console.log()

    const [gitAvailable, pnpmAvailable] = await Promise.all([
        isCmdAvailable('git'),
        isCmdAvailable('pnpm'),
    ])

    if (!gitAvailable) {
        throw new Error(
            'Git is not installed. Please install it and try again.',
        )
    }

    if (!pnpmAvailable) {
        throw new Error(
            'pnpm is not installed. Please install it and try again.',
        )
    }

    const projectName = await promptForProjectName(DEFAULT_PROJECT_NAME)
    const projectDirectory = getProjectDirectory(projectName)

    const spinner = startSpinner(
        `Checking directory ${chalk.cyan(projectDirectory)}...\n`,
    )

    const projectDirectoryExists = await pathExists(projectDirectory)

    if (projectDirectoryExists) {
        handleExistingProjectDirectory(projectDirectory, spinner)
    }

    finishSpinner(spinner, chalk.green('Directory available'))

    const cloneSpinner = startSpinner(`Cloning template...\n`)

    await cloneRepo(TEMPLATE_REPO, projectDirectory)

    finishSpinner(cloneSpinner, chalk.green(chalk.green('Template cloned')))

    const templateSpinner = startSpinner('Setting up template files...\n')

    await replaceInTemplateFiles(
        DEFAULT_PROJECT_NAME,
        projectDirectory,
        projectName,
    )

    finishSpinner(templateSpinner, chalk.green('Template files set up'))

    await removeFile(path.join(projectDirectory, 'CHANGELOG.md'))

    const installSpinner = startSpinner('Installing dependencies...\n')
    await runInstall(projectDirectory)
    finishSpinner(installSpinner, chalk.green('Dependencies installed'))

    const formatAndLintSpinner = startSpinner('Formatting and linting...\n')
    await runFormatAndLint(projectDirectory)
    finishSpinner(formatAndLintSpinner, chalk.green('Formatted and linted\n'))

    finishSpinner(
        spinner,
        chalk.green(
            `Project ${chalk.cyan(projectName)} created in ${chalk.cyan(
                projectDirectory,
            )}`,
        ),
    )
    printNextSteps(projectName)
}

try {
    await main()
} catch (err) {
    console.error((err as Error).message)
    process.exit(1)
}
