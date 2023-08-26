import chalk from 'chalk'
import type { Ora } from 'ora'
import ora from 'ora'

export function startSpinner(label: string): Ora {
    return ora(label).start()
}

export function finishSpinner(spinner: Ora, label: string): void {
    spinner.succeed(label)
}

export function printNextSteps(projectName: string): void {
    console.log()
    console.log('Next steps:')
    console.log(`  ${chalk.blue(`cd ${projectName}`)}`)
    console.log(`  ${chalk.blue('git init')}`)
    console.log(`  ${chalk.blue('make')}`)
}
