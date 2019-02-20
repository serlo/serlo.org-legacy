/**
 * This file is part of Athene2 Assets.
 *
 * Copyright (c) 2017-2019 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/athene2-assets for the canonical source repository
 */
/* global Howl */
import 'howler'
import correctMp3 from '../../../sounds/correct.mp3'
import correctOgg from '../../../sounds/correct.ogg'
import wrongMp3 from '../../../sounds/wrong.mp3'
import wrongOgg from '../../../sounds/wrong.ogg'

const sounds = {
  correct: new Howl({
    src: [correctOgg, correctMp3]
  }),
  wrong: new Howl({
    src: [wrongOgg, wrongMp3]
  })
}

export default key => {
  sounds[key].stop().play()
}
