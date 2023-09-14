/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { input, select } from '@inquirer/prompts'
import type { KeysOfMap, TemplateInfo } from './types.js'
import { color } from './output.js'

export async function promptForProjectName(
    defaultProjectName: string,
): Promise<string> {
    const projectName = await input({
        default: defaultProjectName,
        message: 'What is the name of your project?',
        transformer: (input: string) => {
            return input.trim()
        },
        validate: (input) => {
            if (input.trim().length === 0) {
                return 'Project name cannot be empty'
            }

            if (input.includes(' ')) {
                return 'Project name cannot contain spaces'
            }

            return true
        },
    })

    console.log()

    return projectName
}

export async function promptForTemplateName<
    T extends Map<string, TemplateInfo>,
>(templates: T): Promise<KeysOfMap<typeof templates>> {
    const projectName = await select({
        choices: [...templates.keys()].map((templateKey) => {
            const templateInfo = templates.get(templateKey)!
            const description = color.gray(
                `${templateInfo.description} - ${templateInfo.repository}\n`,
            )

            return {
                description,
                title: templateKey,
                value: templateKey,
            }
        }),
        message: 'Which template would you like to use?',
    })

    console.log()

    return projectName as KeysOfMap<T>
}
