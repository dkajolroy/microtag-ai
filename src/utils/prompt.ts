interface ImageToP {
  tag: number;
}
export function imageToPrompt({ tag }: ImageToP) {
  const prompt = `
  Give me SEO title minimum 6 word and up to [150] character without any symbol, SEO description up to [300] character and SEO tags single word, small letter [${tag}] word from this stock image not free. But the result only title, description and tags without any other  text or other suggestions
  `;
  return prompt;
}
