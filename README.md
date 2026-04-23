# eslint-prettier-for-typescript rev 22/04/25

#### Eslint + Prettier setup without headaches and conflicts

### Instalação do **pnpm** para agilizar a instalação de dependências

[PNPM Docs](https://pnpm.io/pt/installation)

1 - Instale o **pnpm** de modo global, caso não tenha ainda:

```sh
npm i -g pnpm@latest-10
```

```sh
pnpm -v
```

Atualmente, retornou:  
10.33.1

2 - Inicialize um novo projeto:

```sh
pnpm init
```

Acesse o **package.json** e configure nome do projeto, versão, etc e adicione:

```json
"type": "module",
```

### Instalação e configuração do TypeScript

1 - Instale o TypeScript e os Types do Node:

```sh
pnpm add typescript @types/node -D
```

2 - Inicialize o TypeScript

```sh
pnpm tsc --init
```

3 - Acesse as configurações recomendadas para a versão do NodeJs instalada:  
[Node Target Mapping](https://github.com/microsoft/TypeScript/wiki/Node-Target-Mapping)

Meu Node (node -v) atual v24.14.0, então a configuração é **Node 24**.
No **tsconfig.json** modifique:

```json
{
	"compilerOptions": {
		"lib": ["ES2024"],
		"module": "nodenext",
		"target": "ES2024",
		"types": ["node"]
	}
}
```

4 - Crie a pasta **src** e **index.ts** dentro com um simples console.log:

```js
const lang = 'TypeScript'

console.log(`Hello World from ${lang}!`)
```

5 - Adicione a pasta **src** no **tsconfig.json** em **rootDirs** e em **outDir** adicione **dist**:

```json
    "rootDir": "./src",
    /* "rootDirs": [
      "./src"
    ], */
    "outDir": "./dist",
```

6 - Instale o TSX para rodar e monitorar as alterações:

```sh
pnpm add tsx -D
```

7 - Na parte de **scripts** do **package.json** adicione:

```js
// "scripts": {
    "dev": "tsx watch src/index.ts",
    "compile": "tsc",
    "start": "node dist/index.js",
//}
```

8 - Execute no modo de desenvolvimento:

```sh
pnpm run dev
```

Deve sair no console:  
**Hello World from TypeScript!**

9 - Compile:

```sh
pnpm run compile
```

Deve criar a pasta **dist** com **index.js** dentro

10 - Execute no modo de produção:

```sh
pnpm start
```

Deve sair no console:  
**Hello World from TypeScript!** só que dessa vez rodando o .js da pasta dist

11 - Crie um **.gitignore** contendo:

```ini
# Node Modules
node_modules

# Dist Folder
dist
```

12 - Caso precise rodar um unico aquivo **.ts** via terminal use **pnpm tsx** arquivo.ts:

```sh
pnpm tsx src/index.ts
```

13 - Comite como:

```sh
git add .
git commit -m "add and configure TypeScript"
git push
```

---

### Instalação e configuração do Eslint

1 - Instale o Eslint:  
[Getting Started with ESLint](https://eslint.org/docs/latest/use/getting-started)

```sh
pnpm create @eslint/config@latest
```

Siga o passo a passo, altamente intuitivo.  
(Use a barra de espaços para selecionar as opções)

No meu caso:

1. ✔ JavaScript
2. To check syntax and find problems
3. JavaScript modules (import/export)
4. None of these
5. Does your project use TypeScript? ‣ no / **~~yes~~**
6. ✔ Node
7. Javascript (é o arquivo de configuração somente)
8. Would you like to install them now? ‣ No / **~~Yes~~**
9. Choose ▸ **pnpm**

2 - Instale a extensão do Eslint(caso não tenha ainda):

```sh
code --install-extension dbaeumer.vscode-eslint
```

3 - Para testar, vamos provocar um erro comum, adicionando em **index.ts** uma variável sem usá-la posteriormente

```js
let test = 10
```

Deve aparecer em PROBLEMS:  
'test' is assigned a value but never used.

4 - Compile:

```sh
pnpm run compile
```

- Se estiver apontando erro no arquivo index.js da pasta dist
  Para corrigir crie uma regra **ignores: ["dist/*"]** no **defineConfig** em **eslint.config.js**:

```ts
// ...
export default defineConfig([
	// Adicionar aqui
	{ ignores: ['dist/*'] },
	//
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		plugins: { js },
		extends: ['js/recommended'],
	},
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		languageOptions: { globals: globals.node },
	},
	tseslint.configs.recommended,
])
```

Compile novamente ou altere qquer coisa no index.js e salve e veja que agora ele está ignorando essa pasta.

5 - Quanto aos erros **'test' is assigned a value but never used.** etc, prefiro que seja apenas um alerta e não um erro.  
Para alterar isso, devemos criar uma sessão de regras no **eslint.config.js** criado durante a instalação do Eslint

- Note que os erros foram seguidos dos links para documentação das regras:  
  https://eslint.org/docs/latest/rules/prefer-const  
  https://typescript-eslint.io/rules/no-unused-vars

A primeira coisa que aparece bem grande nas páginas é **prefer-const** e **no-unused-vars**  
que são justamente o nome das regras, então basta adicionar na seção **rules** e mudar a definição a gosto.

```js
// ...
export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		plugins: { js },
		extends: ['js/recommended'],
	},
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		languageOptions: { globals: globals.node },
	},
	tseslint.configs.recommended,
	// Adicionar aqui, depois de recommended a sessão de regras:
	{
		rules: {
			'prefer-const': 'warn',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
		},
	},
	//
])
```

6 - Vamos testar se "pegou" a configuração:

Troque por const no index.ts:

```js
const test = 10
test = 4
```

Deve aparecer 2 problems:  
Cannot assign to 'test' because it is a constant.
'test' is assigned a value but never used.

Altere para let:

```js
let test = 10
test = 4
```

E então altere para:

```js
const test = 10
console.log(test)
```

O alerta: 'test' is assigned a value but never used, deve desaparecer.

7 - Caso necessite, crie os comandos na sessão de **scripts** do **package.json**:

```json
"scripts": {
  "lint": "eslint src",
  "lint:fix": "eslint src --fix"
}
```

8 - Para testar, experimente deixar novamente somente o let test = 10; no index.ts para voltar os erros e execute:

```sh
pnpm run lint
```

Veja os dois erros, agora no terminal

Para que ele tente corrigir:

```sh
pnpm run lint:fix
```

Perceba que ele trocou o let por const:

```js
const test = 10
```

- Mas o alerta da variável não ter sido usada, continua. E isso o **--fix** no comando não vai resolver.

Uma maneira de remover a checagem de uma linha espeçifica, que vc tem certeza que vai usar mais tarde é usar como comentário // eslint-disable-next-line. Adicione e veja remover o warning:

```js
// eslint-disable-next-line
const test = 10
```

Para remover a checagem de um arquivo inteiro, adicione no início dele:

```js
/* eslint-disable */
```

Ou um trecho:

```js
/* eslint-disable */
alert('foo')
/* eslint-enable */
```

Veja mais na documentação:  
[Configure Rules](https://eslint.org/docs/latest/use/configure/rules)

9 - Para evitar que ocorra algum erro do tipo:  
Parsing error: No tsconfigRootDir was set... etc

Adicione no **eslint.config.js** também a node_modules no ignore, ficando assim:

```js
{ ignores: ['dist/*', 'node_modules/*'] },
```

E no depois do objeto compilerOptions no **tsconfig.json**, adicione:

```js
  //  existing code
 	"skipLibCheck": true,
  }
  // ...
  ,
  "include": ["src/**/*.ts"],
  "exclude": ["dist", "node_modules"],
```

10 - Comite como:

```sh
git add .
git commit -m "chore: update TypeScript configuration and add ESLint setup"
git push
```

---

### Instalação e configuração do Prettier

- Na versão mais nova do Eslint, não é mais papel dele verificar estilos. Se usa tab ou espaços para indentação, se tem ou não ponto e vírgula, aspas simples ou duplas, etc.  
  Por isso não tem mais as opções de escolher os modelos do Airbnb, Google, etc  
  Para isso, daqui pra frente devemos usar o Prettier para formatação do código.

1 - Instale o Prettier:  
[Install Prettier](https://prettier.io/docs/install)

```sh
pnpm add --save-dev --save-exact prettier
```

2 - Crie o arquivo de exclusão **.prettierignore** e adicione:  
[Ignoring Code](https://prettier.io/docs/ignore)

```ini
# Dist Folder
dist
```

3 - Crie o arquivo de configuração do Prettier, **prettier.config.js** contendo:  
[Prettier Options](https://prettier.io/docs/options)

- Minha configuração:  
  **printWidth=100** - Largura máxima de uma linha (quebra após passar)  
  **endOfLine="lf"** - Quebra de linha, "lf" padrão unix  
  **singleQuote=true** - Aspas simples  
  **quoteProps="as-needed"** - Usa aspas nas propriedases, só quando necessário
  **semi=false** - Sem ponto e virgula  
  **useTabs=true** - Usar tabs em vez de espaços para indentação  
  **tabWidth=4** - Tab equvalente a 4 espaços  
  **arrowParens="always"** - Sempre usa parenteses nas Arrow Functions

```js
/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
	printWidth: 80,
	endOfLine: 'lf',
	singleQuote: true,
	quoteProps: 'as-needed',
	semi: false,
	useTabs: true,
	tabWidth: 4,
	arrowParens: 'always',
}

export default config
```

4 - Instale a extensão do Prettier(caso não tenha ainda):

```sh
code --install-extension esbenp.prettier-vscode
```

5 - Para que funcione ao salvar o arquivo no **settings.json** do VScode tem que adicionar o Prettier como defaultFormatter. Também gosto de usar o autoSave.

- Para abrir, use o ctrl+shift+p, digite **settings.json**, selecione e adicione no final:

```json
"files.autoSave": "afterDelay",
"[typescript]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode"
},
```

Vá no **index.ts** e salve. Devem sumir os ponto e vírgulas, as aspas devem mudar pra simples, etc

6 - Caso queira, crie os comandos na sessão de **scripts** do **package.json**:

```json
"scripts": {
  "check": "prettier --check \"src/**/*.ts\"",
  "format": "prettier --write \"src/**/*.ts\""
}
```

Testando. Vá no **index.ts** e volte aspas duplas e ponto e vírgula.

Verificar:

```sh
pnpm run check
```

Corrigir:

```sh
pnpm run format
```

---

### Garantindo que não vai ter conflito entre o Eslint e o Prettier.

- Aqui que vem a grande sacada para que as duas extensões e pacotes não conflitem e fique um anulando alguma coisa que o outro modificou:  
  [Integrating with Linters](https://prettier.io/docs/integrating-with-linters)

1 - Vendo a documentação acima, vamos instalar o pacote **eslint-config-prettier**:  
[Eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)

```sh
pnpm add -D eslint-config-prettier
```

2 - No arquivo de configuração do Eslint, importe e adicione por último o eslintConfigPrettier no **eslint.config.js**:

```js
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
// Importe
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
	{ ignores: ['dist/*'] },
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		plugins: { js },
		extends: ['js/recommended'],
	},
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		languageOptions: { globals: globals.node },
	},
	tseslint.configs.recommended,
	{
		rules: {
			'prefer-const': 'warn',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
		},
	},
	// Adicione
	eslintConfigPrettier,
])
```

### Organizando as importações.

- Um excelente plugin para organizar os imports e exports é esse:  
  [Simple import sort](https://github.com/lydell/eslint-plugin-simple-import-sort)

1 - Instale

```sh
pnpm add -D eslint-plugin-simple-import-sort
```

2 - No arquivo de configuração do Eslint **eslint.config.js**, importe, adicione como plugin e adicione as regras:

```js
// Importe
import simpleImportSort from 'eslint-plugin-simple-import-sort'

// adicione nos plugins
/* plugins: { js, */ 'simple-import-sort': simpleImportSort /* }, */

/* rules: {
	'prefer-const': 'warn',
	'no-unused-vars': 'off',
	'@typescript-eslint/no-unused-vars': 'warn', */
	'simple-import-sort/imports': 'error',
	/* 'simple-import-sort/exports': 'error', */
/* }, */
```

3 - Adicione esses imports na **index.ts** somente para testar:

```ts
import os from 'node:os'
import path from 'node:path'
import fs from 'node:fs'
```

- Devem ficar sublinhados com erro, por não estarem em ordem alfabética.  
  Ao salvar, eles se organizam indicando que a instalação está OK, permanecendo apenas os warnings de não estarem sendo utilizados.  
  Após testar pode apagar os imports.

4 - Comite como:

```sh
git add .
git commit -m "chore: add Prettier and ESLint configuration files"
git push
```