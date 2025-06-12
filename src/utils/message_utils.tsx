const regex = '[^\\.\\s@:](?:[^\\s@:]*[^\\s@:\\.])?@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*';

// The MIT License (MIT)

// Copyright (c) Kevin Mårtensson <kevinmartensson@gmail.com> and Diego Perini

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

interface RegExOptions {
  /**
		Only match an exact string. Useful with `RegExp#test` to check if a string is a URL.
		@defaultValue false
		*/
  readonly exact?: boolean;
}

export function createUrlRegExp(options: RegExOptions) {
  options = {
    ...options,
  };

  const protocol = `(?:(?:[a-z]+:)?//)?`;
  const auth = '(?:\\S+(?::\\S*)?@)?';
  const ip = new RegExp(
    '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}',
    'g',
  ).source;
  const host = '(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)';
  const domain = '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*';
  const tld = `(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))\\.?`;
  const port = '(?::\\d{2,5})?';
  const path = '(?:[/?#][^\\s"]*)?';
  const regex = `(?:${protocol}|www\\.)${auth}(?:localhost|${ip}|${host}${domain}${tld})${port}${path}`;

  return options.exact ? new RegExp(`(?:^${regex}$)`, 'i') : new RegExp(regex, 'ig');
}

export type TokenizeGrammar = { [type: string]: RegExp };

function createEmailRegExp({ exact }: { exact?: boolean } = {}) {
  return exact ? new RegExp(`^${regex}$`) : new RegExp(regex, 'g');
}
export { createEmailRegExp };

export const createDefaultGrammar = () => {
  return {
    email: createEmailRegExp(),
    url: createUrlRegExp({}),
  } satisfies TokenizeGrammar;
};

export function tokenize<T extends TokenizeGrammar>(input: string, grammar: T) {
  const matches = Object.entries(grammar)
    .map(([type, rx], weight) =>
      Array.from(input.matchAll(rx)).map(({ index, 0: content }) => ({
        type: type as keyof T,
        weight,
        content,
        index: index ?? 0,
      })),
    )
    .flat()
    .sort((a, b) => {
      const d = a.index - b.index;
      return d !== 0 ? d : a.weight - b.weight;
    })
    .filter(({ index }, i, arr) => {
      if (i === 0) return true;
      const prev = arr[i - 1];
      return prev.index + prev.content.length <= index;
    });

  const tokens = [];
  let pos = 0;
  for (const { type, content, index } of matches) {
    if (index > pos) tokens.push(input.substring(pos, index));
    tokens.push({ type, content });
    pos = index + content.length;
  }
  if (input.length > pos) tokens.push(input.substring(pos));
  return tokens;
}
