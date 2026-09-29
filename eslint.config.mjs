import plugin from '@n8n/eslint-plugin-community-nodes';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  ...plugin.configs.recommended,
  files: ['nodes/**/*.ts', 'credentials/**/*.ts'],
  languageOptions: {
    ...plugin.configs.recommended.languageOptions,
    parser: tseslint.parser,
  },
});
