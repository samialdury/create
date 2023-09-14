export type KeysOfMap<T> = T extends Map<infer K, unknown> ? K : never

export interface TemplateInfo {
    description: string
    repository: string
}
