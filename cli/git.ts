import { execa } from 'execa'

export async function cloneRepo(
    repo: `${string}/${string}`,
    projectDirectory: string,
): Promise<void> {
    const repoUrl = repo + '.git'

    await execa('git', ['clone', '--depth=1', repoUrl, projectDirectory])
}
