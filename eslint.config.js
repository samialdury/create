import { eslint } from '@samialdury/config'

export default [
    ...eslint.config({
        node: true,
        rules: {
            'no-console': 'off',
        },
    }),
]
