/* global Howl */
import 'howler'

var soundPath = '/assets/sounds/'
var sounds = {
  correct: new Howl({
    src: [soundPath + 'correct.ogg', soundPath + 'correct.mp3']
  }),
  wrong: new Howl({
    src: [soundPath + 'wrong.ogg', soundPath + 'wrong.mp3']
  })
}

export default key => {
  sounds[key].stop().play()
}
