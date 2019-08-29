import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition, SizeProp } from '@fortawesome/fontawesome-svg-core'
// import { Props as FontAwesomeProps } from '@fortawesome/react-fontawesome/index.d'

import { faInfoCircle, faUserEdit, faUserPlus, faArrowCircleLeft,faArrowCircleRight,faArrowLeft,faArrowRight,faBars,faCaretDown,faCheck,faChevronCircleRight,faChevronUp,faComments,faCopy,faEnvelope,faFlag,faGraduationCap,faHandHoldingHeart,faHistory,faLink,faMapMarkerAlt,faNewspaper,faPencilAlt,faQuestionCircle,faRedo,faReply,faSave,faSearch,faSpinner,faTimes,faTrash,faUndo,faUserCircle,faUserGraduate,faVolumeUp, faCircle, faVideo, faCog
} from '@fortawesome/free-solid-svg-icons'

import { faTwitterSquare, faFacebookSquare } from '@fortawesome/free-brands-svg-icons'

interface iconObject {
  [key: string]: IconDefinition;
}

const icons: iconObject  = {
  faInfoCircle: faInfoCircle, faUserEdit: faUserEdit, faUserPlus: faUserPlus, faArrowCircleLeft: faArrowCircleLeft,faArrowCircleRight: faArrowCircleRight,faArrowLeft: faArrowLeft,faArrowRight: faArrowRight,faBars: faBars,faCaretDown: faCaretDown,faCheck: faCheck,faChevronCircleRight: faChevronCircleRight,faChevronUp: faChevronUp,faComments: faComments,faCopy: faCopy,faEnvelope: faEnvelope,faFlag: faFlag,faGraduationCap: faGraduationCap,faHandHoldingHeart: faHandHoldingHeart,faHistory: faHistory,faLink: faLink,faMapMarkerAlt: faMapMarkerAlt,faNewspaper: faNewspaper,faPencilAlt: faPencilAlt,faQuestionCircle: faQuestionCircle,faRedo: faRedo,faReply: faReply,faSave: faSave,faSearch: faSearch,faSpinner: faSpinner,faTimes: faTimes,faTrash: faTrash,faUndo: faUndo,faUserCircle: faUserCircle,faUserGraduate: faUserGraduate,faVolumeUp: faVolumeUp,
  faTwitterSquare: faTwitterSquare, faFacebookSquare: faFacebookSquare, faCircle: faCircle, faVideo: faVideo, faCog: faCog
}

export type AllowedIcons = keyof (typeof icons)

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
    <FontAwesomeIcon className={props.className} size={props.size} icon={getIcon(props.icon.toString())} />
  )
}
