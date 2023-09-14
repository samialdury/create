import type { Ora } from 'ora'
import ora from 'ora'
import color from 'picocolors'
import type { TemplateInfo } from './types.js'

export { default as color } from 'picocolors'

export function startSpinner(label: string): Ora {
    return ora(label).start()
}

export function finishSpinner(spinner: Ora, label: string): void {
    spinner.succeed(label)
}

export function printHelp<T extends Map<string, TemplateInfo>>(
    packageName: string,
    templates: T,
    author: string,
    version: string,
): void {
    console.log()
    console.log('A CLI for scaffolding out new projects.\n')
    console.log('Author\t\t', color.bold(author))
    console.log('Version\t\t', color.bold(version))
    console.log()
    console.log(
        color.cyan(
            `Usage: ${color.green(packageName)} ${color.gray(
                '[options]',
            )} ${color.yellow('<template>')} ${color.yellow(
                '<project-name>',
            )}\n`,
        ),
    )
    console.log('Options:')
    console.log(`  ${color.bold('-h, -H, --help, help')}\t\tPrint this message`)
    console.log(
        `  ${color.bold('-v, -V, --version, version')}\tPrint the CLI version`,
    )
    console.log()
    console.log('Arguments:')
    console.log(
        `  ${color.yellow(
            '<template>',
        )}\t\t\tThe template to use. Must be one of:`,
    )
    for (const [templateName, templateInfo] of templates) {
        console.log(
            `        ${color.bold(templateName)}\t\t${
                templateInfo.description
            }`,
        )
    }
    console.log()
    console.log(
        '    If no template is specified, you will be prompted to choose one.',
    )
    console.log()
    console.log(
        `  ${color.yellow(
            '<project-name>',
        )}\t\tThe name/directory of the project`,
    )
    console.log()
    console.log(
        '    If no name/directory is specified, you will be prompted to enter one.',
    )

    console.log()
}

export function printVersion(version: string): void {
    console.log(version)
}

export function printNextSteps(relativeDirectory: string): void {
    console.log()
    console.log('Next steps:')
    console.log(`  ${color.blue(`cd ${relativeDirectory}`)}`)
    console.log(`  ${color.blue('git init')}`)
    console.log(`  ${color.blue('make help')}`)
    console.log()
}
