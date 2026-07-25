# SMC-ICT Trade Signal Adapter - Deployment Guide

## Phase 5: Production Deployment & Monitoring

### Overview

This phase provides complete deployment configurations for running the SMC-ICT Trade Signal Adapter in production environments including Docker, Kubernetes, and CI/CD pipelines.

### 📦 Docker Deployment

#### Build Docker Image

```bash
docker build -t smc-ict-adapter:latest .
```

#### Run Container

```bash
docker run -d \
  --name smc-ict-adapter \
  -p 3000:3000 \
  -e NODE_ENV=production \
  smc-ict-adapter:latest
```

#### Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### ☸️ Kubernetes Deployment

#### Prerequisites

- Kubernetes cluster (1.20+)
- kubectl configured
- Docker image pushed to registry

#### Deploy

```bash
# Apply deployment
kubectl apply -f k8s/deployment.yaml

# Check deployment status
kubectl get deployments
kubectl describe deployment smc-ict-adapter

# View pods
kubectl get pods -l app=smc-ict-adapter

# View service
kubectl get svc smc-ict-adapter-service
```

#### Scaling

```bash
# Scale to 3 replicas
kubectl scale deployment smc-ict-adapter --replicas=3
```

#### Logs

```bash
# View pod logs
kubectl logs -f pod/smc-ict-adapter-xxxxx

# View all pod logs
kubectl logs -f deployment/smc-ict-adapter
```

### 🔄 CI/CD Pipeline

GitHub Actions workflow automatically:

1. **Lint Code** - ESLint validation
2. **Build** - TypeScript compilation
3. **Test** - Run full test suite
4. **Coverage** - Generate coverage reports
5. **Docker Build** - Build and cache Docker image (on main branch)

#### Trigger Workflow

- Push to `main` or `develop` branch
- Pull requests to `main` or `develop`

#### View Workflow Status

Go to: `https://github.com/usmantukurbaba/SMC-ICT-Trade-Signal-Adapter-App/actions`

### 📊 Monitoring & Logging

#### Health Checks

The application includes health check endpoints:

- `/health` - Liveness probe
- `/ready` - Readiness probe

#### Logs

Logs are written to:
- Console (stdout)
- File: `./logs/app.log` (if mounted)

#### Environment Variables

```bash
NODE_ENV=production          # Environment
LOG_LEVEL=info              # Logging level (debug, info, warn, error)
PORT=3000                   # Application port
```

### 🔐 Security Best Practices

1. **Use secrets for sensitive data**
   ```bash
   kubectl create secret generic app-secrets --from-literal=api-key=xxx
   ```

2. **Enable RBAC**
   ```bash
   kubectl apply -f rbac.yaml
   ```

3. **Network Policies**
   - Restrict ingress/egress traffic
   - Use service mesh (Istio/Linkerd)

4. **Image Security**
   - Use minimal base images (alpine)
   - Scan for vulnerabilities
   - Use private registry

### 📈 Scaling & Performance

#### Horizontal Scaling

```bash
# Auto-scale based on CPU
kubectl autoscale deployment smc-ict-adapter --min=2 --max=10 --cpu-percent=80
```

#### Resource Management

- **Requests**: Guaranteed resources
- **Limits**: Maximum resources allowed

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### 🚀 Deployment Checklist

- [ ] Build image locally and test
- [ ] Run tests and verify coverage
- [ ] Review Dockerfile for security
- [ ] Configure environment variables
- [ ] Set up monitoring/alerts
- [ ] Configure logging
- [ ] Test health endpoints
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Monitor for errors

### 📝 Configuration Files

- **Dockerfile** - Container definition
- **docker-compose.yml** - Multi-container orchestration
- **k8s/deployment.yaml** - Kubernetes manifests
- **.github/workflows/ci.yml** - CI/CD pipeline

### 🆘 Troubleshooting

#### Container won't start
```bash
docker logs smc-ict-adapter
```

#### Pod crashes in Kubernetes
```bash
kubectl describe pod smc-ict-adapter-xxxxx
kubectl logs smc-ict-adapter-xxxxx
```

#### Health check failing
- Check endpoint availability
- Review application logs
- Verify network connectivity

### 📚 Related Documentation

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [GitHub Actions](https://github.com/features/actions)

---

**Phase 5 Status**: ✅ Complete
