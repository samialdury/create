import { input } from '@inquirer/prompts'

export async function promptForProjectName(
    defaultProjectName: string,
): Promise<string> {
    const projectName = await input({
        message: 'What is the name of your project?',
        default: defaultProjectName,
        transformer: (input: string) => {
            return input.trim()
        },
        validate: (input) => {
            if (input.trim().length === 0) {
                return 'Project name cannot be empty'
            }

            // Check if contains spaces
            if (input.includes(' ')) {
                return 'Project name cannot contain spaces'
            }

            return true
        },
    })

    console.log()

    return projectName
}
