export const addAnalyticsScript = () => {
  const { VITE_GOOGLE_ANALYTICS_ID, VITE_STAT_PROJECT_ID, VITE_STAT_SECURITY_ID } = import.meta.env;
  const result = []
  if (VITE_GOOGLE_ANALYTICS_ID) {
    const arr_google = [
      { src: `https://www.googletagmanager.com/gtag/js?id=${VITE_GOOGLE_ANALYTICS_ID}`, async: true, body: true },
      {
        innerHTML: `window.dataLayer = window.dataLayer || []
      function gtag() {
        dataLayer.push(arguments)
      }
      gtag('js', new Date())
      gtag('config', ${VITE_GOOGLE_ANALYTICS_ID})`,
        body: true,
      },
    ]
    result.push(...arr_google)
  }
  if (VITE_STAT_PROJECT_ID && VITE_STAT_SECURITY_ID) {
    const arr_stat = [
      {
        innerHTML: `var sc_project=${VITE_STAT_PROJECT_ID};
          var sc_invisible=1;
          var sc_security="${VITE_STAT_SECURITY_ID}";
        `,
        body: true,
      },
      {
        src: 'https://www.statcounter.com/counter/counter.js',
        async: true,
        body: true,
      },
    ]
    result.push(...arr_stat)
  }

  return result
}