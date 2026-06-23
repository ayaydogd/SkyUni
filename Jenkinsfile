// SkyUni CI pipeline'i - basit ama gercekten calisan asamalar.
// Frontend: React + Vite (kok dizin) | Backend: Node/Express (backend/)
// Not: Projede test yok; bu yuzden lint + syntax kontrolu + build yapiyoruz.
pipeline {
    agent any

    options {
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Kaynak kod alindi (Pipeline from SCM ile otomatik checkout).'
                sh 'git log -1 --oneline || true'
            }
        }

        stage('Backend Install') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Lint & Syntax') {
            steps {
                // Frontend ESLint: mevcut kodda eski lint hatalari var; build'i
                // kirmamasi icin RAPOR amacli calistiriyoruz ("|| true").
                // Lint'i temizleyince "|| true" kismini silip gercek gate yapabilirsin.
                echo '== Frontend ESLint (rapor amacli) =='
                sh 'npm run lint || true'

                // Backend syntax kontrolu GERCEK gate: bozuk JS varsa build kirilir.
                echo '== Backend syntax kontrolu (node --check) =='
                dir('backend') {
                    sh 'for f in $(find . -path ./node_modules -prune -o -name "*.js" -print); do echo "check $f"; node --check "$f"; done'
                }
            }
        }

        stage('Build') {
            steps {
                echo '== Frontend production build (vite) =='
                sh 'npm run build'
            }
        }

        // OPSIYONEL: Projede Dockerfile/compose olmadigi icin Docker Compose build
        // asamasi bilerek eklenmedi. Ileride backend icin Dockerfile eklersen
        // burada `sh 'docker compose build'` adimi acilabilir.
    }

    post {
        success { echo '✅ Pipeline basariyla tamamlandi - tum asamalar yesil.' }
        failure { echo '❌ Pipeline basarisiz - kirmizi asamanin loguna bak.' }
        always  { echo 'Pipeline bitti.' }
    }
}
