import { cloneDeep } from 'lodash';

const generateRequestJson = (
  url: string | { api: string },
  title: string,
  jsonData: Record<string, any>,
  contentType?: 'json'
) => {
  jsonData = cloneDeep(jsonData);

  const resultUrl = typeof url === 'string' ? url : url.api; // storybook api mock

  if (contentType !== 'json') {
    for (const key in jsonData) {
      if (typeof jsonData[key] === 'boolean') {
        jsonData[key] = jsonData[key] + '';
      }
    }
  }
  const jsonContent = JSON.stringify(jsonData)
    .replace(/,"/g, ',\n"')
    .replace('{', '{\n');

  const headersContent =
    contentType === 'json'
      ? `"headers": {"content_type":"application/json"},\n`
      : '';

  return `\n[{\n  "url": "${resultUrl}",\n  "title": "${title}",\n  ${headersContent}"json": ${jsonContent}\n}]\n`;
};

export default generateRequestJson;
