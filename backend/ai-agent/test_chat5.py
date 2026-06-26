import httpx
import asyncio
import json

async def test():
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post('http://127.0.0.1:8000/api/v1/chat', json={'message': 'Where should I export my spices? give me opportunity scores.', 'session_id': 'test_session_new_2'})
            print(json.dumps(resp.json(), indent=2))
    except Exception as e:
        print(f"Error class: {e.__class__.__name__}")
        print(f"Error str: {e}")

asyncio.run(test())
