import requests
import time
import json

def test_search(query):
    url = "https://ifrof.com/api/trpc/aiAgent.searchFactories?batch=1"
    payload = {
        "0": {
            "json": {
                "query": query,
                "language": "en"
            }
        }
    }
    start = time.time()
    try:
        response = requests.post(url, json=payload, timeout=45)
        duration = time.time() - start
        print(f"Query: {query}")
        print(f"Status: {response.status_code}")
        print(f"Duration: {duration:.2f}s")
        # Note: We can't see server logs directly here, but we can check if it succeeds
        if response.status_code == 200:
            print("Result: SUCCESS")
        else:
            print(f"Result: FAILED - {response.text}")
    except Exception as e:
        print(f"Error: {str(e)}")
    print("-" * 20)

queries = ["LED lighting", "Cotton textile", "CNC machinery parts in Shenzhen"]
for q in queries:
    test_search(q)
