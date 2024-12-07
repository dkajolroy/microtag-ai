interface ImageToP {
  tag: number;
}
export function imageToPrompt({ tag }: ImageToP) {
  const prompt = `
  Give me SEO title minimum 6 word and up to [150] character without any symbol, 
  SEO description up to [300] character and 
  [${tag}] SEO tags single word, small letter from this image. 
  But the result only title, description and tags without any other text  or other suggestions. 
  Don't use [free] word and don't use colon mark. 
  Information type [silhouette vector, vector art or normal photos ] related but detect you automatically. 
  Image type [icon, design, art, illustration or normal photos] detect you automatically 
  If you detect image object is vector illustration with only black color object, so please use silhouette word in the title and description in any position.
  If you detect image object is vector illustration with multi color, so don't use silhouette word in the title and description
 `;
  return prompt;
}
