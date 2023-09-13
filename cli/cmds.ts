import { execa } from 'execa'
import which from 'which'

export async function runInstall(projectDirectory: string): Promise<void> {
    await execa('make', ['install', 'skip-postinstall=true'], {
        cwd: projectDirectory,
    })
}

export async function runPrepareScript(
    projectDirectory: string,
    projectName: string,
): Promise<void> {
    await execa('make', ['prepare', `name=${projectName}`], {
        cwd: projectDirectory,
    })
}

export async function isCmdAvailable(cmd: string): Promise<boolean> {
    return !!(await which(cmd, { nothrow: true }))
}
