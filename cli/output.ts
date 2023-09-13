import type { Ora } from 'ora'
import ora from 'ora'
import color from 'picocolors'

export function startSpinner(label: string): Ora {
    return ora(label).start()
}

export function finishSpinner(spinner: Ora, label: string): void {
    spinner.succeed(label)
}

export function printNextSteps(projectName: string): void {
    console.log()
    console.log('Next steps:')
    console.log(`  ${color.blue(`cd ${projectName}`)}`)
    console.log(`  ${color.blue('git init')}`)
    console.log(`  ${color.blue('make help')}`)
}
