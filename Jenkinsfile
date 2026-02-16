pipeline {
    agent any

    environment {
        IMAGE_NAME = 'my-image'
    }

    stages {
        stage('Build') {
            steps {
                script {
                    // Build commands
                    sh 'echo Building the image...'
                }
            }
        }
        stage('Prod Test') {
            steps {
                script {
                    // Test commands
                    sh 'apk update'
                    sh 'echo Testing in production environment...'
                }
            }
        }
    }
}