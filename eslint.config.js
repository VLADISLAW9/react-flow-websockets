import { eslint } from '@siberiacancode/eslint';

/** @type {import('eslint').Linter.FlatConfig} */
export default eslint({
  typescript: true,
  react: true,
  jsx: true,
  'jsx-a11y': true
});
