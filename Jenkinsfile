pipeline{
    agent any

    environment{
        IMAGE_NAME = "iron5pi3dr11/health-app"
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
                    apk update && apk add --no-cache curl
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
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker build -t iron5pi3dr11/health-app:${IMAGE_TAG} .
                        docker push iron5pi3dr11/health-app:${IMAGE_TAG}
                        docker logout
                        '''
                }
            }
        }

        stage('Manual Approval'){
            steps{
                script{
                    timeout(time: 30, unit: 'MINUTES') {   // adjust as you like
                    input message: "Deploy to PRODUCTION?", ok: "Approve Deploy"
                }
            }
        }

        stage('Prod Deploy'){

            environment{
                PROD_IP = '43.205.125.207'
                PROD_USER = 'ubuntu'
                PROD_HOST = "${PROD_USER}@${PROD_IP}"
                CONTAINER_NAME = 'HealthCheckApp'
                APP_PORT = '3000'
            }

            steps{
                sshagent(credentials: ['prod-ec2-ssh-key']){
                    sh """
                        set -eux

                        ssh -o StrictHostKeyChecking=no ${PROD_HOST} '
                        set -e

                        docker pull '"${IMAGE_NAME}:${IMAGE_TAG}"'

                        docker rm -f '"${CONTAINER_NAME}"' 2>/dev/null || true

                        docker run -d --name '"${CONTAINER_NAME}"' --restart unless-stopped \
                            -e PORT='"${APP_PORT}"' \
                            -e NODE_ENV=production \
                            -e APP_VERSION='"${IMAGE_TAG}"' \
                            -p 127.0.0.1:'"${APP_PORT}"':'"${APP_PORT}"' \
                            '"${IMAGE_NAME}:${IMAGE_TAG}"'
                        '
                    """
                }
            }
        }

        stage('Prod Test'){
            environment {
                PROD_IP = '43.205.125.207'
                PROD_USER = 'ubuntu'
                PROD_HOST = "${PROD_USER}@${PROD_IP}"
            }
            steps {
                sshagent(credentials: ['prod-ec2-ssh-key']) {
                    sh """
                        set -eux

                        ssh -o StrictHostKeyChecking=no ${PROD_HOST} '
                        set -e
                        # Test through Nginx (public entrypoint), locally on the instance
                        for i in {1..30}; do
                            curl -fsS http://localhost/health >/dev/null && break
                            sleep 1
                        done

                        curl -fsS http://localhost/health
                        curl -fsS http://localhost/status
                        '
                    """
                }
            }
        }
    }

}