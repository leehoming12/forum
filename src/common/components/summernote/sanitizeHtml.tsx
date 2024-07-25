import sanitize, { defaults } from 'sanitize-html';

export const sanitizeHtml = (html: string) => sanitize(html, {
  allowedTags: [
    ...defaults.allowedTags,
    'img',
    'iframe',
    'font',
  ],
  allowedAttributes: {
    '*': ['style', 'class'],
    a: ['href', 'name', 'target'],
    img: ['src', 'width', 'height'],
    iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
    font: ['color'],
  },
  allowedStyles: {
    '*': {
      color: [
        /^#(0x)?[0-9a-f]+$/i,
        /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
      ],
      'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
      width: [/^\d+(px|%)$/],
      height: [/^\d+(px|%)$/],
      'background-color': [
        /^#(0x)?[0-9a-f]+$/i,
        /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
      ],
    },
  },
});
