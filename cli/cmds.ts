import { execa } from 'execa'
import which from 'which'

export async function runInstall(projectDirectory: string): Promise<void> {
    await execa('pnpm', ['install'], {
        cwd: projectDirectory,
    })
}

export async function runFormatAndLint(
    projectDirectory: string,
): Promise<void> {
    await execa('make', ['format', 'lint'], {
        cwd: projectDirectory,
    })
}

export async function isCmdAvailable(cmd: string): Promise<boolean> {
    return !!(await which(cmd, { nothrow: true }))
}
