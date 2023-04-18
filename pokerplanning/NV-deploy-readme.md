# How to Build and Deploy to NVC Dev Cluster

## Requirements
* Have AWS CLI installed
* Have Helm installed
* Have `kubectl` installed

## Steps
1. In a terminal, set the AWS access credentials (message NVC team if you don't have them): `export AWS_SECRET_ACCESS_KEY=<KEY_HERE>
export AWS_ACCESS_KEY_ID=<KEY_ID_HERE>`
2. Configure your `kubectl`: `aws eks --region <REGION> update-kubeconfig --name <CLUSTER_NAME>`
3. Log in to docker.navvis.com with your user so that the `build.sh` script can pull and push images there
4. Run `../build.sh`
5. Then execute in this directory: `helm uninstall planningpoker --namespace planningpoker` followed by `helm install planningpoker --namespace planningpoker --create-namespace . --set application.image=<INSERT_CLUSTER_REPO_URL_HERE:WITH_TAG>`
6. You can check the URL by looking at the name of `kubectl -n planningpoker get ingress`
7. Done!

For help, please reach out to the NVC team!