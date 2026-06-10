import React, { createContext, useContext, useEffect, useState } from 'react'

const LANGUAGE_STORAGE_KEY = 'todayler_root_language'

const RootLanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
})

function readStoredLanguage() {
  if (typeof window === 'undefined') {
    return null
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return storedLanguage === 'el' || storedLanguage === 'en' ? storedLanguage : null
}

function readBrowserLanguage() {
  if (typeof window === 'undefined') {
    return null
  }

  const browserLocales = [
    ...(Array.isArray(window.navigator.languages) ? window.navigator.languages : []),
    window.navigator.language,
    window.Intl?.DateTimeFormat?.().resolvedOptions?.().locale,
  ].filter(Boolean)

  return browserLocales.some((locale) => String(locale).toLowerCase().startsWith('el')) ? 'el' : null
}

export function RootLanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => readStoredLanguage() ?? readBrowserLanguage() ?? 'en')

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (nextLanguage) => {
    setLanguageState(nextLanguage)
  }

  const toggleLanguage = () => {
    setLanguageState((currentLanguage) => (currentLanguage === 'en' ? 'el' : 'en'))
  }

  return (
    <RootLanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </RootLanguageContext.Provider>
  )
}

export function useRootLanguage() {
  return useContext(RootLanguageContext)
}
