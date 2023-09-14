export class CreateError extends Error {
    public exitCode: number

    constructor(message: string, exitCode = 1) {
        super(message)
        this.name = 'CreateError'
        this.exitCode = exitCode
    }
}

export function isCreateError(err: unknown): err is CreateError {
    return err instanceof CreateError
}

export function isInquirerError(err: unknown): err is Error {
    return (
        err instanceof Error &&
        err.message.includes('User force closed the prompt')
    )
}

export function isUnknownError(err: unknown): err is Error {
    return err instanceof Error
}
