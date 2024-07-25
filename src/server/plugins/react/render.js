
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { PageSSRContext } from '~/common/components/page/ssr';
import { I18nextProvider } from 'react-i18next';
import { ServerResourceContext } from '~/common/hooks/serverResource/context';

export async function renderToHTML(App, resource, {
  req, res, env, jsSrc, cssSrc,
}) {
  const pageSSRContext = {};
  const Main = () => (
    <I18nextProvider i18n={req.i18n}>
      <PageSSRContext.Provider value={pageSSRContext}>
        <ServerResourceContext.Provider value={resource}>
          <StaticRouter location={req.path}><App /></StaticRouter>
        </ServerResourceContext.Provider>
      </PageSSRContext.Provider>
    </I18nextProvider>
  );
  const body = ReactDOMServer.renderToString(<Main />);

  const html = (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        {!_.isEmpty(pageSSRContext.title) && <title>{pageSSRContext.title}</title>}
        {_.map(pageSSRContext.meta, (value, key) => (
          <meta key={key} name={key} content={value} />
        ))}
        <link rel="stylesheet" type="text/css" href={cssSrc} />
      </head>
      <body>
        <div id='root' dangerouslySetInnerHTML={{ __html: body }} />
        <script id='env' type='text/plain' dangerouslySetInnerHTML={{ __html: JSON.stringify(env) }} />
        <script id='resource' type='text/plain' dangerouslySetInnerHTML={{ __html: JSON.stringify(resource ?? {}) }} />
        <script src={jsSrc}></script>
      </body>
    </html>
  );

  const { pipe } = ReactDOMServer.renderToPipeableStream(html, {
    onShellReady() {
      res.setHeader('content-type', 'text/html');
      pipe(res);
    }
  });
}
