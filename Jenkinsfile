pipeline{
    agent any
    stages{
        stage('Build'){
            agent{
                docker{
                    image 'node:18-alpine'
                    reuseNode true
                    args '--user root' 
                }
            }
            steps{
                sh '''
                    apk get update && apk install update
                    apk add --no-cache curl
                    npm install
                    npm ci
                    npm test
                '''
            }
        }
    }

}
