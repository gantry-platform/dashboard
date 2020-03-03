def label = "worker-${UUID.randomUUID().toString()}"

podTemplate(
    label: label,
    containers: [
        containerTemplate(name: 'git', image: 'alpine/git', command: 'cat', ttyEnabled: true),
        containerTemplate(name: 'docker', image: 'docker', command: 'cat', ttyEnabled: true)
    ],
    volumes: [
        hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')
    ]
) {
    node(label) {
        def app_name = 'dashboard'
        def tag = '0.1'
        // def build_number = ${env.BUILD_NUMBER}
        def branch_name = "${BUILD_TYPE}" == 'prod' ? 'master' : 'dev-master'
        def git_url = 'https://gitlab.gantry.ai/gantry/platform/dashboard.git'
        def harbor_url = 'harbor.gantry.ai'
        def harbor_project = 'gantry'

        stage('Clone Repository') {
            container('git') {
                checkout([
                    $class: 'GitSCM', 
                    branches: [[name: "*/${branch_name}"]], 
                    doGenerateSubmoduleConfigurations: false, 
                    extensions: [[$class: 'CloneOption', timeout: 300], [$class: 'RelativeTargetDirectory', relativeTargetDir: "./${app_name}"]],
                    submoduleCfg: [], 
                    userRemoteConfigs: [[credentialsId: "${GITLAB_CREDENTIALS_ID}", url: "${git_url}"]]
                ])
            }
        }

        stage('Build docker image') {
            container('docker') {
                if("${branch_name}" == 'master') {
                    sh "docker build -t ${app_name} --build-arg BUILD=build-prod ./${app_name}"
                } else {
                    sh "docker build -t ${app_name} --build-arg BUILD=build-dev ./${app_name}"
                }
                sh "docker images ${app_name}"
            }
        }

        stage('Tag docker image') {
            container('docker') {
                sh "docker tag ${app_name} ${harbor_url}/${harbor_project}/${app_name}:${tag}"
                sh "docker images ${harbor_url}/${harbor_project}/${app_name}:${tag}"
            }
        }

        stage('Push docker image') {
            container('docker') {
                docker.withRegistry("https://${harbor_url}", "${HARBOR_CREDENTIALS_ID}") {
                    sh "docker push ${harbor_url}/${harbor_project}/${app_name}:${tag}"
                }
            }
        }

        stage('Remove docker image') {
			container('docker') {
				sh "docker rmi ${app_name}:latest"
				sh "docker rmi ${harbor_url}/${harbor_project}/${app_name}:${tag}"
                sh "docker images"
			}
		}

        stage('Remove app') {
            sh "rm -rf ${app_name}"
            sh "rm -rf ${app_name}@tmp"
            sh "ls -al"
        }
    }
}
