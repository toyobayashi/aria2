interface Options {
  /**
  Uppercase the first character: `foo-bar` → `FooBar`.

  @default false
  */
  readonly pascalCase?: boolean
}

const preserveCamelCase = (string: string): string => {
  let isLastCharLower = false
  let isLastCharUpper = false
  let isLastLastCharUpper = false

  for (let i = 0; i < string.length; i++) {
    const character = string[i]

    if (isLastCharLower && /[\p{Lu}]/u.test(character)) {
      string = string.slice(0, i) + '-' + string.slice(i)
      isLastCharLower = false
      isLastLastCharUpper = isLastCharUpper
      isLastCharUpper = true
      i++
    } else if (isLastCharUpper && isLastLastCharUpper && /[\p{Ll}]/u.test(character)) {
      string = string.slice(0, i - 1) + '-' + string.slice(i - 1)
      isLastLastCharUpper = isLastCharUpper
      isLastCharUpper = false
      isLastCharLower = true
    } else {
      isLastCharLower = character.toLocaleLowerCase() === character && character.toLocaleUpperCase() !== character
      isLastLastCharUpper = isLastCharUpper
      isLastCharUpper = character.toLocaleUpperCase() === character && character.toLocaleLowerCase() !== character
    }
  }

  return string
}

export function camelcase (input: string | readonly string[], o?: Options): string {
  if (!(typeof input === 'string' || Array.isArray(input))) {
    throw new TypeError('Expected the input to be `string | string[]`')
  }

  const options = {
    ...{ pascalCase: false },
    ...o
  }

  const postProcess = (x: string): string => options.pascalCase ? x.charAt(0).toLocaleUpperCase() + x.slice(1) : x

  if (Array.isArray(input)) {
    input = input.map(x => x.trim())
      .filter(x => x.length)
      .join('-')
  } else {
    input = input.trim()
  }

  if (input.length === 0) {
    return ''
  }

  if (input.length === 1) {
    return options.pascalCase ? input.toLocaleUpperCase() : input.toLocaleLowerCase()
  }

  const hasUpperCase = input !== input.toLocaleLowerCase()

  if (hasUpperCase) {
    input = preserveCamelCase(input)
  }

  input = input
    .replace(/^[_.\- ]+/, '')
    .toLocaleLowerCase()
    .replace(/[_.\- ]+([\p{Alpha}\p{N}_]|$)/gu, (_, p1) => p1.toLocaleUpperCase())
    .replace(/\d+([\p{Alpha}\p{N}_]|$)/gu, m => m.toLocaleUpperCase())

  return postProcess(input)
}
