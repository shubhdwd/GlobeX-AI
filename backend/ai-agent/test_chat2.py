import httpx
import asyncio

async def test():
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post('http://127.0.0.1:8000/api/v1/chat', json={'message': 'Where should I export my spices? give me opportunity scores.', 'session_id': 'test_session_new'})
            print("Status:", resp.status_code)
            print("Response:", resp.text)
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(test())
