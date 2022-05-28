import React from "react";
import logo from "../../images/appbar/logo_header.png";
import logo_yellow from "../../images/appbar/logo_header_yellow_bulb.png";
import Link from 'next/link';


const LogoLink = ({ color }) => {
    return (
        <div>
            <Link href="/">
                <a>
                <img src={color == "transparent" ? logo_yellow : logo} alt="Hoe Zit Het? logo" />
                Hoe Zit Het?
                </a>
            </Link>
            <style jsx>{`
                a {
                    margin: .5rem;
                    display: flex;
                    flex-grow: 1;
                    align-items: center;
                    font-weight: 600;
                    color: inherit;
                }
                a:hover {
                    text-decoration: none;
                }
                img {
                    height: 1rem;
                    margin-right: .5rem;
                }
            `}</style>
        </div>
    );
};

const QuickLinks = () => {
    return (
        <div>
            <Link href="/lessen"><a>Lessen</a></Link>
            <span>|</span>
            <Link href="/trakteer"><a>Drankje trakteren</a></Link>
            <span>|</span>
            <Link href="/about"><a>Over HZH</a></Link>
        </div>
    );
};

const HzhAppBar = () => {
    return (
        <div>
            <LogoLink />
            <ButtonLinks />
        </div>
    );
};

export default HzhAppBar;