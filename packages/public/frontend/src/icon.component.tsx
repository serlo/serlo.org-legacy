/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition, SizeProp } from '@fortawesome/fontawesome-svg-core'
// import { Props as FontAwesomeProps } from '@fortawesome/react-fontawesome/index.d'

import {
  faInfoCircle,
  faUserEdit,
  faUserPlus,
  faArrowCircleLeft,
  faArrowCircleRight,
  faArrowLeft,
  faArrowRight,
  faBars,
  faCaretDown,
  faCheck,
  faChevronCircleRight,
  faChevronUp,
  faComments,
  faCopy,
  faEnvelope,
  faFlag,
  faGraduationCap,
  faHandHoldingHeart,
  faHistory,
  faLink,
  faMapMarkerAlt,
  faNewspaper,
  faPencilAlt,
  faQuestionCircle,
  faRedo,
  faReply,
  faSave,
  faSearch,
  faSpinner,
  faTimes,
  faTrash,
  faUndo,
  faUserCircle,
  faUserGraduate,
  faVolumeUp,
  faCircle,
  faVideo,
  faCog,
  faShareAlt,
  faCompass
} from '@fortawesome/free-solid-svg-icons'

import {
  faTwitterSquare,
  faFacebookSquare,
  faGoogle,
  faGithubSquare,
  faWhatsappSquare
} from '@fortawesome/free-brands-svg-icons'

interface iconObject {
  [key: string]: IconDefinition
}

const icons: iconObject = {
  faInfoCircle: faInfoCircle,
  faUserEdit: faUserEdit,
  faUserPlus: faUserPlus,
  faArrowCircleLeft: faArrowCircleLeft,
  faArrowCircleRight: faArrowCircleRight,
  faArrowLeft: faArrowLeft,
  faArrowRight: faArrowRight,
  faBars: faBars,
  faCaretDown: faCaretDown,
  faCheck: faCheck,
  faChevronCircleRight: faChevronCircleRight,
  faChevronUp: faChevronUp,
  faComments: faComments,
  faCopy: faCopy,
  faEnvelope: faEnvelope,
  faFlag: faFlag,
  faGraduationCap: faGraduationCap,
  faHandHoldingHeart: faHandHoldingHeart,
  faHistory: faHistory,
  faLink: faLink,
  faMapMarkerAlt: faMapMarkerAlt,
  faNewspaper: faNewspaper,
  faPencilAlt: faPencilAlt,
  faQuestionCircle: faQuestionCircle,
  faRedo: faRedo,
  faReply: faReply,
  faSave: faSave,
  faSearch: faSearch,
  faSpinner: faSpinner,
  faTimes: faTimes,
  faTrash: faTrash,
  faUndo: faUndo,
  faUserCircle: faUserCircle,
  faUserGraduate: faUserGraduate,
  faVolumeUp: faVolumeUp,
  faTwitterSquare: faTwitterSquare,
  faFacebookSquare: faFacebookSquare,
  faCircle: faCircle,
  faVideo: faVideo,
  faCog: faCog,
  faShareAlt: faShareAlt,
  faGoogle: faGoogle,
  faWhatsappSquare: faWhatsappSquare,
  faCompass: faCompass,
  faGithubSquare: faGithubSquare
}

export type AllowedIcons = keyof typeof icons

// type Props = Exclude<"icon", FontAwesomeProps> & { icon: AllowedIcons, className: string, size: string }

// interface Props extends Exclude<"icon", FontAwesomeProps>{
//   icon: AllowedIcons
// }

const getIcon = (name: string) => {
  let icon = icons[name]
  if (!icon) {
    console.log("Can't find icon: " + name)
    return faCircle
  }
  return icon
}

interface IconProps {
  icon: AllowedIcons
  className?: string
  size?: SizeProp
}

export function Icon(props: IconProps) {
  return (
    <FontAwesomeIcon
      className={props.className}
      size={props.size}
      icon={getIcon(props.icon.toString())}
    />
  )
}
