import { eslint } from '@samialdury/config'

export default [
    ...eslint.config({
        node: true,
        typeScript: true,
        rules: {
            'no-console': 'off',
        },
    }),
]
