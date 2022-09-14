pipeline {
    agent any
    tools { nodejs 'Nodejs' }

    environment {
        GSAP_TOKEN = credentials('96b5a2fa-fbf3-4d98-a76c-b7e83a2cd874')
        HZH_DIR = credentials('7e1c2019-6860-4844-bddb-dc4e79ca3a8f')
    }
    stages {
        stage('requirement install') {
            steps {
                sh 'npm install -g gatsby-cli'
                sh 'npm config set //npm.greensock.com/:_authToken=$GSAP_TOKEN'
                sh 'npm config set @gsap:registry=https://npm.greensock.com'
                sh 'npm install gsap@npm:@gsap/shockingly'
                sh 'npm install --legacy-peer-deps'
                sh 'bash scripts/install_quicksand.sh'
                sh 'bash scripts/install_emoji_font.sh'
            }
        }
        stage('build gatsby site') {
            steps {
		sshagent(credentials: ['e32ad635-f8bb-44c1-80d4-9b6f87ec4d05']) {
		    sh 'rsync hoezithet.nu:$HZH_DIR/.env.production ${env.WORKSPACE}'
		}
                sh 'gatsby build'
            }
        }
        stage('deploy') {
            steps {
		sshagent(credentials: ['e32ad635-f8bb-44c1-80d4-9b6f87ec4d05']) {
                    sh 'rsync -r --delete-after ${env.WORKSPACE}/public/ $hoezithet.nu:$HZH_DIR/public_${env.BRANCH_NAME}'
                    sh 'node scripts/create_lesson_pdfs_pngs.js --host=$(if [[ ${env.BRANCH_NAME} = "develop" ]]; then echo "dev.hoezithet.nu"; else echo "hoezithet.nu"; fi) --cwd=${env.WORKSPACE}'
                    sh 'rsync -r --delete-after ${env.WORKSPACE}/public/ hoezithet.nu:$HZH_DIR/public_${env.BRANCH_NAME}'
		}
            }
        }
        stage('clean workspace') {
            steps {
                cleanWs()
            }
        }
    }
}
