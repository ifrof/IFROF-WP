import { useEffect } from 'react';

const GTM_ID = 'GTM-XXXXXXX'; // Replace with real ID

export default function GTM() {
  useEffect(() => {
    const w = window as any;
    const d = document;
    const s = 'script';
    const l = 'dataLayer';
    const i = GTM_ID;

    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s) as HTMLScriptElement;
    const dl = l !== 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    if (f && f.parentNode) {
      f.parentNode.insertBefore(j, f);
    }
  }, []);

  return null;
}
