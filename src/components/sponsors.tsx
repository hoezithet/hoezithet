import React from 'react';
import kuLeuvenLogo from "../../images/sponsor/KULEUVEN_RGB_LOGO.png";
import vivesLogo from "../../images/sponsor/VIVES.png";
import Link from 'next/link';
import Image from 'next/image';

const Treat = () => {
    return (
        <p>
            Wil jij ook steunen? Trakteer Hoe Zit Het? op een drankje! 🥤 Ga daarvoor naar <Link href="/trakteer"><a>de trakteer-pagina</a></Link>.
        </p>
    );
};


export default function Sponsors({ width = "56mm", showTreat = true}) {
    return (
        <div>
            <p>Hoe Zit Het? wordt met trots gesteund door</p>
            <div>
                <div>
                    <a href="https://www.kuleuven.be/kuleuven">
                        <Image src={ kuLeuvenLogo } alt="KU Leuven sponsor" />
                    </a>
                </div>
                <div>
                    <a href="https://www.vives.be/">
                        <Image src={ vivesLogo } alt="VIVES sponsor" />
                    </a>
                </div>
            </div>
            { showTreat ? <Treat/> : null }
            <style jsx>{`
                img {
                    width: ${width};
                }
                div {
                    break-inside: avoid;
                }
                p {
                    font-weight: bold;
                }
            `} </style>
        </div>
    );
}
