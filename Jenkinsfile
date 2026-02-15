pipeline{
    agent any

    environment{
        IAMGE_NAME = "iron5pi3dr11/health-app"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

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

        stage('Build & Push Docker Image'){
            steps{
                withCredentials([usernamePassword(credentialsId: 'devopsproject2-docker-creds', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    sh '''
                        docker build -t iron5pi3dr11/health-app:${IMAGE_TAG} .
                        docker push iron5pi3dr11/health-app:${IMAGE_TAG}
                        '''
                }
            }
        }
    }

}
