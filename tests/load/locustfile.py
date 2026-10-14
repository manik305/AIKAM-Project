"""Locust Load Test Script: Simulates 100 -> 1,000 -> 10,000 Concurrent Users.

Verifies AKS Horizontal Pod Autoscaling (HPA) and Cluster Autoscaler behavior.
"""

from locust import HttpUser, task, between
import random


class CitizenLoadTestUser(HttpUser):
    wait_time = between(0.5, 2.0)

    @task(3)
    def query_bill_breakdown(self):
        units = random.choice([45, 95, 150, 195, 215, 340])
        self.client.post("/api/v1/chat/query", json={
            "message": f"Why is my bill calculated for {units} units?",
            "preferred_language": "te",
            "units": units
        })

    @task(1)
    def check_health(self):
        self.client.get("/health")
