import React from 'react';
import HzhTheme from 'components/theme';
import HzhAppBar from 'components/appbar';
import Sponsors from 'components/sponsors';
import Footer from 'components/footer';
import COLORS from 'colors.js';
import landingImg from "../images/landing/landing_large.png";
import archer from "../images/landing/archer.png";
import free from "../images/landing/free.png";
import guts from "../images/landing/guts.png";
import Link from 'next/link';
import Image from 'next/image';


const WhyHzhTriangle = () => {
    return (
        <a href="#why">
            <div/>
            <style jsx>{`
                div {
                    width: 0;
                    height: 0;
                    border-top-width: 2rem;
                    border-right-width: 3rem;
                    border-left-width: 3rem;
                    border-style: solid;
                    border-color: ${COLORS.NEAR_WHITE} transparent transparent transparent;
                    margin: auto;
                    margin-bottom: 1rem;
                }
            `}</style>
        </a>
    );
};

interface WhyHzhItemProps {
    children: React.ReactElement|string;
    title: string;
    img: string;
}

const WhyHzhItem = (props: WhyHzhItemProps) => {
    return (
        <div className="root">
            <div className="imgWrapper">
                <Image src={ props.img } />
            </div>
            <h2>{ props.title }</h2>
            <div>
                { props.children }
            </div>
            <style jsx>{`
                .imgWrapper {
                    border: .25rem solid ${COLORS.GOLD};
                    border-radius: 1rem;
                    height: 8rem;
                    width: 8rem;
                    padding: 1rem;
                    background-color: ${COLORS.NEAR_WHITE};
                }
                img {
                    height: 100%;
                }
            `}</style>
        </div>
    );
};

const WhyHzhItems = ({exampleUrl}) => {
    return (
        <div>
            <WhyHzhItem title="Doelgericht" img={ archer }>
                Elke les is gericht op één onderwerp. Zo kan je gaatjes in je kennis snel opvullen, zonder omwegen. 
            </WhyHzhItem>
            <WhyHzhItem title="Verteerbaar" img={ guts }>
                Niemand houdt van saai. Daarom bestaan onze lessen steeds uit een heldere uitleg met veel illustraties. Zo helpen we je om alles in een handomdraai te begrijpen.
            </WhyHzhItem>
            <WhyHzhItem title="Gratis" img={ free }>
                Omdat iedereen recht heeft op kennis, zijn alle lessen gratis. Voor vandaag. Voor morgen. Voor altijd.
            </WhyHzhItem>
            <Link href={ exampleUrl }>
                <a>Toon mij een voorbeeld!</a>
            </Link>
            <style jsx>{`
            `}</style> 
        </div>
    );
};

const LandingImg = ({exampleUrl}) => {
    return (
        <div>
            <Link href={ exampleUrl }>
                <a><Image src={landingImg}/></a>
            </Link>
            <style jsx>{`
                img {
                    margin: auto;
                    width: 100%;
                }
                div {
                    padding: 1em 2em;
                    display: flex;
                    justify-content: center;
                }
            `}</style>
        </div>
    );
};

const WaaromHZH = ({exampleUrl}) => {
    return (
        <div id="why" className="root">
            <h2>Waarom <span>Hoe Zit Het?</span></h2>
            <div>
                <WhyHzhTriangle />
                <WhyHzhItems exampleUrl={exampleUrl}/>
            </div>
            <Sponsors />
            <style jsx>{`
                .root {
                    textAlign="center"
                    justifyContent="center"
                }
                h2 {
                    font-size: 36pt;
                    font-weight: normal;
                    margin: 2rem;
                }
                span {
                    white-space: nowrap;
                    font-weight: bold;
                }
                div {
                    background-color: rgba(255, 183, 0, 0.25);
                    padding-bottom: 3em;
                }
            `}</style>
        </div>
    );
};

export default function Landing() {
    const exampleUrl = "/lessen/fysica/krachten_1/krachtvector/";
    return (
        <HzhTheme>
            <HzhAppBar color="transparent" elevation={ 0 } />
            <LandingImg exampleUrl={exampleUrl}/>
            <WaaromHZH exampleUrl={exampleUrl}/>
            <Footer />
        </HzhTheme>
    );
};
