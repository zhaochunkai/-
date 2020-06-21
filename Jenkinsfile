pipeline {
    agent any

    environment {
        CONTAINER_NAME = 'ets-frontend-saas'
        IMAGE_NAME = 'ets-frontend-saas'
	}

    stages {
        stage('构建') {
            when {
                branch 'SaaS'
            }
            steps {
                sh 'docker build -t $IMAGE_NAME -f Deploy.dockerfile .'
            }
        }

        stage('部署') {
            steps {
                sh 'docker-compose -f docker-compose.Deploy.yaml down'
                sh 'docker-compose -f docker-compose.Deploy.yaml up -d'
            }
        }

        stage('清理') {
            steps {
                sh 'docker image prune -f'
                sh 'docker container prune -f'
            }
        }
    }
}