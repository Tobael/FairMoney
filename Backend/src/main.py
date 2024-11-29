from contextlib import asynccontextmanager
from typing import Generator

import uvicorn
from fastapi import FastAPI
from starlette import status
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse

from src.controller.accounting_controller import accounting_router
from src.controller.group_controller import group_router
from src.controller.payments_controller import payments_router
from src.shared.db_session_manager import sessionmanager


@asynccontextmanager
async def lifespan(app: FastAPI) -> Generator[any, any, None]:
    yield
    await sessionmanager.close()


app = FastAPI(title="FairMoney Backend", version="0.1.0")

app.add_middleware(CORSMiddleware,
                   allow_origins=["*"],
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"])

app.include_router(group_router)
app.include_router(payments_router)
app.include_router(accounting_router)


@app.get(path="/",
         include_in_schema=False)
def get_default_docs() -> RedirectResponse:
    return RedirectResponse(url="/docs",
                            status_code=status.HTTP_308_PERMANENT_REDIRECT)


if __name__ == "__main__":
    uvicorn.run("__main__:app", port=8001, reload=True)
