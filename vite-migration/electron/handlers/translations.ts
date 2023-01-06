import { Translate } from '@google-cloud/translate/build/src/v2/index';
async function getTranslationHandler(
  event: Electron.IpcMainEvent,
  { text, source, target, key }: { text: string; source: string; target: string; key: string }
) {
  const translate = new Translate({ key });
  const options = {
    from: source,
    to: target
  };
  let [translation] = await translate.translate(text, options);
  event.sender.send('get-translation-return', translation);
}

export default [{ name: 'get-translation', handler: getTranslationHandler }];
