import React from 'react';
import Head from 'next/head';

interface MatomoProps {
}

function Matomo(props: MatomoProps) {
    return (
        <Head>
            <script type="text/javascript">
                {`
                var _paq = window._paq = window._paq || [];
                /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
                _paq.push(['trackPageView']);
                _paq.push(['enableLinkTracking']);
                (function() {
                    var u="https://hoezithet.matomo.cloud/";
                    _paq.push(['setTrackerUrl', u+'matomo.php']);
                    _paq.push(['setSiteId', '1']);
                    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                    g.type='text/javascript'; g.async=true; g.src='//cdn.matomo.cloud/hoezithet.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
                })();
                `}
            </script>
        </Head>
    )
}

export const trackEvent = (category, action, name, value) => {
    if (typeof window !== `undefined`) {
        const _paq = window._paq = window._paq || [];
        _paq.push(['trackEvent', category, action, name, value]);
    }
};

export default Matomo;
