import i18n, {
  i18n as I18n,
  Module,
  Newable,
  Resource,
  ThirdPartyModule
} from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'

export { i18n, I18n }

export async function initI18n({
  resources,
  language
}: {
  resources: Resource
  language: string
}): Promise<void> {
  await i18n.use(initReactI18next).init({
    debug: process.env.NODE_ENV !== 'production',
    defaultNS: 'default',
    nsSeparator: ':::',
    keySeparator: '::',
    fallbackLng: 'en',
    lng: language,
    resources
  })
}

export async function initI18nWithBackend<B extends Module>({
  backend,
  options,
  language
}: {
  backend: B | Newable<B> | ThirdPartyModule[] | Newable<ThirdPartyModule>[]
  options?: object
  language: string
}): Promise<void> {
  await i18n
    .use(initReactI18next)
    .use(backend)
    .init({
      debug: process.env.NODE_ENV !== 'production',
      ns: ['default'],
      defaultNS: 'default',
      nsSeparator: ':::',
      keySeparator: '::',
      fallbackLng: 'en',
      lng: language,
      backend: options
    })
}

export async function setLanguage(language: string): Promise<void> {
  await i18n.changeLanguage(language)
}

export function useI18n(): I18n {
  const { i18n } = useTranslation()
  return i18n
}
