import httpx
import asyncio

async def test():
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post('http://localhost:8000/api/v1/chat', json={'message': 'Where should I export my spices? give me opportunity scores.', 'session_id': 'test_session_20'})
            print(resp.status_code)
            print(resp.text)
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(test())
