import { LOCAL_STORAGE_DEVICE,LOCAL_STORAGE_TIMEOUT } from "../helpers/consts"
import { useEffect } from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { firebaseNotification } from '../helpers/firebase'
import moment from "moment"
import { isSafari } from 'react-device-detect'
import theme from '../helpers/theme'
import { logoutAccount } from '../services/api/auth.api'
import '../styles/globals.css'
import '../styles/admin.css'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Register service worker
    // if ("serviceWorker" in navigator) {
    //   window.addEventListener("load", function () {
    //     this.navigator.serviceWorker.register("/firebase-messaging-sw.js")
    //     .then(function (registration) {
    //       console.log("Service worker registration successful with scope: ", registration.scope)
    //     },
    //     function (err) {
    //       console.log("Service worker registration failed: ", err)
    //     })
    //   });
    // }

    // Set moment locale to browser language
    const lang = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage
    moment.locale(lang)

    // Get token device from firebase
    var device = localStorage.getItem(LOCAL_STORAGE_DEVICE)
    if (!isSafari) {
      firebaseNotification().then((token) => {
          if (device != token) {
              device = token
              localStorage.setItem(LOCAL_STORAGE_DEVICE, token)
          }
      })
      .catch((err) => {
          console.log(err)
      })
    }
  }, [])

  useEffect(() => {
    // Set idle timer to logout
    var timer = null
    var timeout = localStorage.getItem(LOCAL_STORAGE_TIMEOUT)
    if (timeout > 0) {
      var out = timeout * 60 * 1000
      timer = setTimeout(() => {
        logoutAccount()
      }, out)
    }

    return () => {
      if (timer != null) {
        clearTimeout(timer)
      }
    }
  })

  return <ThemeProvider theme={theme}>
    <Component {...pageProps} />
  </ThemeProvider>
}

export default MyApp
