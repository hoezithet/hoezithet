import React from 'react';
import { Helmet } from 'react-helmet';

interface MatomoProps {
}

function Matomo(props: MatomoProps) {
    return (
        <Helmet>
            <script type="text/javascript">
                {`
                  var _paq = window._paq = window._paq || [];
                  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
                  _paq.push(['trackPageView']);
                  _paq.push(['enableLinkTracking']);
                  (function() {
                    var u="//matomo.hoezithet.nu/";
                    _paq.push(['setTrackerUrl', u+'matomo.php']);
                    _paq.push(['setSiteId', '1']);
                    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                    g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
                  })();
                `}
            </script>
        </Helmet>
    )
}

export const trackEvent = (category, action, name, value) => {
    if (typeof window !== `undefined`) {
        const _paq = window._paq = window._paq || [];
        _paq.push(['trackEvent', category, action, name, value]);
    }
};

export default Matomo;
