/* Athene2 Editor
 * Serverside Markdown Parser
 *
 * Uses a slightly modified version of showdown.
 *
 * Offers a `render` method via dNode.
 *
 */
import express from 'express'

import { render } from './index.gcf'

const app = express()

app.post('/', render);

app.listen(3000, () => {
    console.log('Listening...');
});
