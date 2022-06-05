import React from "react";
import Layout from 'components/layout';
import notFoundImg from '../images/404/404.png';
import Link from 'next/link';


export default function NotFoundPage() {
    const crumbs = [{
        slug: "",
        title: "404"
    }];
    return (
        <Layout crumbs={ crumbs }>
            <div>
                <img src={ notFoundImg } />
                <h1>Hier zit je niet goed...</h1>
                <p>
                    De pagina waar je naar surfte, bestaat helaas niet...
                </p>
                <Link href="/lessen/">
                    <a>Ga naar alle lessen</a>
                </Link>
                <style jsx>{`
                    div {
                        text-align: center;
                    }
                    img {
                        margin: auto;
                        width: 50%;
                    }
                `}</style>
            </div>
        </Layout>
    );
}
