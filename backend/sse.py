from fastapi.responses import StreamingResponse
import asyncio
import os
from concurrent.futures import ThreadPoolExecutor
from create_map_poster import generate_poster_web

executor = ThreadPoolExecutor(max_workers=1)

def poster_sse_stream(city, country, theme, distance, output_format):

    async def event_stream():
        loop = asyncio.get_event_loop()

        def run_generation():
            return generate_poster_web(
                city=city,
                country=country,
                theme=theme,
                distance=distance,
                output_format=output_format
            )

        # initial logs
        yield f"event: log\ndata: Loaded theme: {theme}\n\n"
        await asyncio.sleep(0.3)

        yield "event: log\ndata: Looking up coordinates...\n\n"
        await asyncio.sleep(0.3)

        yield "event: log\ndata: Rendering poster (this may take ~20–40s)...\n\n"

        # 🔥 RUN BLOCKING CODE IN THREAD
        future = loop.run_in_executor(executor, run_generation)

        # 🔄 keep connection alive while working
        while not future.done():
            yield "event: log\ndata: Working...\n\n"
            await asyncio.sleep(2)

        output_path = future.result()

        if not os.path.exists(output_path):
            yield "event: error\ndata: Poster generation failed\n\n"
            return

        filename = os.path.basename(output_path)
        yield f"event: done\ndata: http://localhost:8000/output/{filename}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )
