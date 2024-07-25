import _ from 'lodash';
import React from 'react';

import { sanitizeHtml } from './sanitizeHtml';
import { blobToDataUrl } from '~/common/utils';

type SummernoteProps = {
  initialValue?: string;
  onChange?: (html: string) => void;
  onBlur?: (ev: Event) => void;
  essentials?: boolean;
};

export const Summernote: React.FC<SummernoteProps> = ({
  initialValue,
  onChange,
  onBlur,
  essentials,
}) => {

  const ref = React.useRef<HTMLDivElement>(null);

  const toolbar = _.compact([
    !essentials && ['style', ['style']],
    ['font', [
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'superscript',
      'subscript',
      'color',
      'clear',
    ]],
    !essentials && ['para', ['ul', 'ol', 'paragraph']],
    !essentials && ['table', ['table']],
    !essentials && ['insert', ['hr', 'link', 'picture', 'video']],
    !essentials && ['view', ['codeview', 'undo', 'redo']],
  ]);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.innerHTML = initialValue ?? '';

    const editor = $(element).summernote({
      toolbar: toolbar as any,
      disableDragAndDrop: true,
      dialogsInBody: true,
      styleTags: ['p', 'blockquote', 'h2', 'h3', 'h4', 'h5', 'h6'],
      callbacks: {
        onChange(v) {
          onChange?.(editor.summernote('isEmpty') ? '' : v);
        },
        onBlur,
        async onImageUpload([blob]) {
          const file = new Parse.File('img', { uri: await blobToDataUrl(blob) });
          await file.save();
          editor.summernote('insertImage', file.url());
        },
        onPaste(e: any) {
          e.preventDefault();

          const clipboard = (e.originalEvent || e).clipboardData;
          const html = clipboard.getData('text/html');
          const text = clipboard.getData('text');

          if (html) {
            editor.summernote('pasteHTML', sanitizeHtml(html));
          } else {
            editor.summernote('insertText', text);
          }
        },
      },
    });

    return () => {
      editor.summernote('destroy');
    };

  }, []);

  return (
    <div ref={ref} />
  );
}


