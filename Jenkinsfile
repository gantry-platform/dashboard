def label = "worker-${UUID.randomUUID().toString()}"

podTemplate(
    label: label,
    containers: [
        containerTemplate(name: 'docker', image: 'docker:dind', privileged: true, ttyEnabled: true)
    ]
) {
    node(label) {
        def app_name = 'dashboard'
        def tag = '0.1'
        def branch_name = "${BUILD_TYPE}" == 'build-prod' ? 'master' : 'dev-master'
        // Gitlab
        def git_url = 'https://gitlab.gantry.ai/gantry/platform/dashboard.git'
        def gitlab_credentials_id = "${GITLAB_CREDENTIALS_ID}"
        // Harbor
        def harbor_url = 'harbor.gantry.ai'
        def harbor_project = 'gantry'
        def harbor_credentials_id = "${HARBOR_CREDENTIALS_ID}"

        stage('Clone Repository') {
            checkout([
                $class: 'GitSCM', 
                branches: [[name: "*/${branch_name}"]], 
                doGenerateSubmoduleConfigurations: false, 
                extensions: [[$class: 'CloneOption', timeout: 300], [$class: 'RelativeTargetDirectory', relativeTargetDir: "./${app_name}"]],
                submoduleCfg: [], 
                userRemoteConfigs: [[credentialsId: "${gitlab_credentials_id}", url: "${git_url}"]]
            ])
        }

        stage('Build docker image') {
            container('docker') {
                if("${branch_name}" == 'master') {
                    sh "docker build -t ${app_name} --build-arg BUILD_TYPE=${BUILD_TYPE} ./${app_name}"
                } else {
                    sh "docker build -t ${app_name} --build-arg BUILD_TYPE=${BUILD_TYPE} ./${app_name}"
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
                docker.withRegistry("https://${harbor_url}", "${harbor_credentials_id}") {
                    sh "docker push ${harbor_url}/${harbor_project}/${app_name}:${tag}"
                }
            }
        }
    }
}