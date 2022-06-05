import React from "react";
import COLORS from "../colors.js";
import Image from 'next/image';
import Link from 'next/link';

import default_title_img from '../images/default_title_img.png';

interface SectionItemProps {
    title: string;
    cardImage: string;
    link: string;
    children?: React.ReactElement|string;
}


export default function SectionCard({title, cardImage=null, link, children}: SectionItemProps) {
    cardImage = cardImage || default_title_img.src;

    return (
        <div className="root">
            <div style={{width: '100%', height: '100%', position: 'relative'}}>
                <Link href={link}>
                    <a><Image src={cardImage} alt={title} layout="fill" objectFit="contain"/></a>
                </Link>
            </div>
            <div>
                { title }
            </div>
            <div>
                 { children }
            </div>
            <style jsx>{`
                .root {
                    background-color: ${COLORS.NEAR_WHITE};
                    height: 140px;
                }
            `}</style>
        </div>
    );
}
