#!/usr/bin/env bash
WORKSPACE=$(pwd)
BRANCH_NAME=$(git symbolic-ref --short -q HEAD)
export $(cat .env.production | xargs)
npm config set //npm.greensock.com/:_authToken=$GSAP_TOKEN
npm config set @gsap:registry=https://npm.greensock.com
npm install gsap@npm:@gsap/shockingly --legacy-peer-deps
npm install --legacy-peer-deps
gatsby clean
gatsby build
rsync -r --delete-after $WORKSPACE/public/ $HZH_USER@hoezithet.nu:$HZH_DIR/public_$BRANCH_NAME
node node_modules/puppeteer/install.js
node scripts/create_lesson_pdfs_pngs.js --host=$(if [[ $BRANCH_NAME = "develop" ]]; then echo "dev.hoezithet.nu"; else echo "hoezithet.nu"; fi) --cwd=$WORKSPACE
rsync -r --delete-after $WORKSPACE/public/ $HZH_USER@hoezithet.nu:$HZH_DIR/public_$BRANCH_NAME
