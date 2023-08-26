import { execa } from 'execa'

export async function cloneRepo(
    repo: `${string}/${string}`,
    projectDirectory: string,
): Promise<void> {
    await execa('pnpm', ['dlx', 'tiged', repo, projectDirectory])
}
