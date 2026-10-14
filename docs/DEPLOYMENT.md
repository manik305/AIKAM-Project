# UrjaMitra AI: Deployment & Infrastructure Manual

This document outlines the phased deployment progression:
1. **Local Evaluation (Docker Compose)**: Fast one-command setup for hackathon evaluators.
2. **Infrastructure as Code (Terraform)**: Automated Azure cloud provisioning.
3. **Production Rollout (Azure Kubernetes Service)**: Elastic autoscaling with HPA and Cluster Autoscaler.

---

## 1. Local Evaluator Quickstart (Docker Compose)

### Prerequisites:
- Docker Desktop 24+ & Docker Compose v2+

### Commands:
```bash
# 1. Clone repository and navigate to root
cd "Aikam Project"

# 2. Configure environment file
cp .env.example .env

# 3. Launch full stack (FastAPI, PostgreSQL 16, Redis)
docker-compose -f docker/docker-compose.yml up --build -d

# 4. Check running containers
docker-compose -f docker/docker-compose.yml ps
```
Access endpoints:
- Swagger Docs: `http://localhost:8000/docs`
- Citizen Portal: `http://localhost:8000/`

---

## 2. Cloud Provisioning via Terraform

### Prerequisites:
- Terraform CLI >= 1.5.0
- Azure CLI logged in (`az login`)

### Commands:
```bash
cd terraform/

# 1. Initialize provider plugins
terraform init

# 2. Plan resource changes
terraform plan -out=tfplan.binary

# 3. Apply infrastructure
terraform apply tfplan.binary
```
Resources provisioned:
- Azure Resource Group (`centralindia`)
- Virtual Network & Delegated Subnets
- AKS Cluster with dynamic auto-scaling node pool (2 to 12 nodes)
- Azure Managed PostgreSQL Flexible Server (v16)
- Azure Cache for Redis

---

## 3. Kubernetes Deployment & Autoscaler Rollout

Connect to the provisioned AKS cluster:
```bash
az aks get-credentials --resource-group urjamitra-prod-rg --name urjamitra-prod-aks

# Apply ConfigMaps and Secrets
kubectl apply -f k8s/configmap-secrets.yaml

# Deploy API Pods & Services
kubectl apply -f k8s/api-deployment.yaml

# Enable Horizontal Pod Autoscaler (HPA)
kubectl apply -f k8s/api-hpa.yaml

# Enable KEDA Queue Autoscaler
kubectl apply -f k8s/ocr-worker-keda.yaml

# Apply Ingress
kubectl apply -f k8s/ingress.yaml
```

Verify autoscaler status:
```bash
kubectl get hpa urjamitra-api-hpa --watch
```
