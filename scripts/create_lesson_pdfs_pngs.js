const puppeteer = require('puppeteer');
const glob = require('glob');
const path = require('path');


const {
    host="hoezithet.nu",
    protocol="https",
    port=null,
    cwd=process.cwd(),
    pattern="public/bare/lessen/*/*/*/index.html"
} = require('minimist')(process.argv.slice(2));

(async () => {
    const browser = await puppeteer.launch({timeout: 0, args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
    page.setDefaultTimeout(0);
    const files = glob.sync(pattern, {cwd: cwd});
    console.log(`Found ${files.length} files`);

    for (const f of files) {
        const slug = f.split("/").slice(-6, -1).join("/");
        const htmlPath = `${protocol}://${host}${port ? ":" + port : ""}/${slug}/`;
        console.log(`Fetching page ${htmlPath}`);
        await page.goto(htmlPath, {waitUntil: "networkidle2"});
        const title = await page.title();
        
        console.log("Saving pdf");
        const footerHtml = `
            <div style="font-family: Quicksand; color: #D3D3D3; font-size: 10px; padding-right: 100px; padding-left: 100px; padding-bottom: 20px; display: flex; justify-content: space-between; width: 100%;">
                <span>Hoe Zit Het? - <span class="title"></span></span> <span>p. <span class="pageNumber"></span>/<span class="totalPages"></span></span>
            </div>
        `;

        // E.g. /lessen/wiskunde/afgeleiden_1/afgeleide_functie
        // becomes afgeleiden_1-afgeleide_functie
        const pdfStem = slug.split('/').slice(3).join("-");

        const lessonPath = f.replace("index.html", "").replace("/bare", "");

        await page.pdf({
            path: `${lessonPath}${pdfStem}.pdf`,
            format: 'A4',
            printBackground: true,
            margin: {
                top: "100px",
                left: "150px",
                right: "150px",
                bottom: "100px"
            },
            displayHeaderFooter: true,
            footerTemplate: footerHtml,
            headerTemplate: '<span></span>',
        });

        const svgs = await page.$$(".drawing");
        for (const [i, svg] of svgs.entries()) {
            const pngPath = `${lessonPath}${slug.split('/').slice(2).join('_')}-${i + 1}.png`;
            console.log(`Saving ${pngPath}`);
            await svg.screenshot({path: pngPath});
        }
    }
    await browser.close();
})();
