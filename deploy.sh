#!/usr/bin/env bash
WORKSPACE=$(pwd)
BRANCH_NAME=$(git symbolic-ref --short -q HEAD)
export $(cat .env.production | xargs)
source ~/.nvm/nvm.sh
nvm use 16.20.2 &&\
npm install --legacy-peer-deps
npm run clean
npm run build &&\
nvm use 20.16.0 &&\
npx wrangler pages deploy $WORKSPACE/public --project-name=hoezithet &&\
nvm use 16.20.2 &&\
node node_modules/puppeteer/install.js &&\
node scripts/create_lesson_pdfs_pngs.js --host=$(if [[ $BRANCH_NAME = "develop" ]]; then echo "dev.hoezithet.nu"; else echo "hoezithet.nu"; fi) --cwd=$WORKSPACE &&\
nvm use 20.16.0 &&\
npx wrangler pages deploy $WORKSPACE/public --project-name=hoezithet
