import React from "react";
import COLORS from "../colors.js";
import Image from 'next/image';
import Link from 'next/link';


interface SectionItemProps {
    title: string;
    cardImage: string;
    link: string;
    children?: React.ReactElement|string;
}


export default function SectionCard({title, cardImage, link, children}: SectionItemProps) {
    return (
        <div className="root">
            <Link href={link}>
                <a><Image src={cardImage} alt={title}/></a>
            </Link>
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