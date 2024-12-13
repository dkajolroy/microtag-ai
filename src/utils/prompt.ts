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

// multi
export function keywordPrompt({ tag }: { tag: number }) {
  const dd = `
  Generate a JSON array without variables. Object key is title, description and tags. 
  Detect image one by one automatically fill up titles, descriptions and tags SEO friendly.
  Title must be more than 8 words but Don't use [free] word and don't use colon mark. 
  Not give past title again And ${tag} SEO tags single word and small letter must.
  Detect image for relevant all information. (logo, art, silhouette, wallpaper, mockup, transparent, vector, illustration, raster ) And Image object (position, situation, capture mode, quality, weather, light ) etc.
  If you detect image object is black and if it is illustration file so please use silhouette word in the title description.
  If you detect image object is no black, so don't use silhouette word in the title and description.

  Give me only json data without any other information or suggestions.
  `;
  return dd;
}
