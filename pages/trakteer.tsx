import React from "react";
import Layout from 'components/layout';
import donate from "../images/trakteer/donate.png";
import Link from 'next/link';
import Image from 'next/image';


interface TrakteerProps {
    children: React.ReactNode;
    amount: string;
    icon: string;
    text: string;
    href: string;
}

function TrakteerButton(props: TrakteerProps) {
    return (
        <Link href={ props.href }>
            <a>
                <div>{ props.icon }</div>
                <div>{ props.text }</div>
                <div>{ `(${props.amount})` }</div>
            </a>
        </Link>
    );
}


export default function Trakteer() {
    const crumbs = [{
        slug: "/trakteer",
        title: "Trakteer",
    }];
    return (
        <Layout crumbs={ crumbs } >
            <h1>🥤 Trakteer op een drankje!</h1>
            <Image src={ donate } />
            <p>
                Wil je Hoe Zit Het? graag steunen? Dat kan! Via onderstaande knoppen kan je Hoe Zit Het? trakteren op een symbolisch drankje! 🥤 Jouw traktatie zal integraal worden gebruikt om de website verder uit te breiden met meer lessen, meer illustraties en meer verlichte uitleg! 💡 Zo zorg jij er mee voor dat Hoe Zit Het? voor iedereen helemaal gratis kan blijven! 🙌
            </p>
            <div>
                <TrakteerButton href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YZBJ7U5JFSQ8G&source=url" amount="€2" icon="🥤" text="Frisdrankje" />
                <TrakteerButton href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NHE8CFLULN9WG&source=url" amount="€4" icon="☕" text="Frappuccino"/>
                <TrakteerButton href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TCLFUBNZ3QUGN&source=url" amount="€10" icon="🍻" text="Tournée Générale!"/>
                <TrakteerButton href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=X8BH56ZVUG2BQ&source=url" amount="Eigen bedrag" icon="🎁" text="Zelf iets kiezen"/>
            </div>
            <style jsx>{`
                img {
                    display: block;
                    margin: auto;
                }
            `}</style>
        </Layout>
    );
}
