pipeline{
    agent any
    stages{
        stage('Build'){
            agent{
                docker{
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps{
                sh '''
                    apk install update && add --no-cache curl
                    npm install
                    npm ci
                    npm test
                '''
            }
        }
    }

}
