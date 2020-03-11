def g_pod_label = "worker-${UUID.randomUUID().toString()}"
def g_worker_namespace = "jenkins"

podTemplate(
    label: g_pod_label,
    containers: [
        containerTemplate(name: 'docker', image: 'docker:dind', privileged: true, ttyEnabled: true)
    ],
    yaml: """
        apiVersion: v1
        kind: Pod
        metadata:
          name: ${g_pod_label}
          namespace: ${g_worker_namespace}
          labels:
            label: ${g_pod_label}
        spec:
          tolerations:
          - key: "role.gantry.ai"
            operator: "Equal"
            value: "build"
            effect: "NoSchedule"
          nodeSelector:
            role.gantry.ai: build
    """
) {
    node(g_pod_label) {
        def app_name = 'dashboard'
        def tag = "dev-v${env.BUILD_NUMBER}"
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
                sh "docker images"
            }
        }

        stage('Tag docker image') {
            container('docker') {
                sh "docker tag ${app_name} ${harbor_url}/${harbor_project}/${app_name}:${tag}"
                sh "docker images"
            }
        }

        stage('Push docker image') {
            container('docker') {
                docker.withRegistry("https://${harbor_url}", "${harbor_credentials_id}") {
                    sh "docker push ${harbor_url}/${harbor_project}/${app_name}:${tag}"
                }
            }
        }

        stage ('Archive build output') {
            sh "echo APP_NAME=${app_name} > jenkins-properties"
            sh "echo IMAGE=${harbor_url}/${harbor_project}/${app_name}:${tag} >> jenkins-properties"
            
            archiveArtifacts 'jenkins-properties'
            sh 'cat jenkins-properties'
		}

    }
}
