from contextlib import asynccontextmanager
from typing import Generator

import uvicorn
from fastapi import FastAPI
from starlette import status
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse

from controller.accounting_controller import accounting_router
from controller.group_controller import group_router
from controller.payments_controller import payments_router
from shared.db_session_manager import sessionmanager


@asynccontextmanager
async def lifespan(app: FastAPI) -> Generator[any, any, None]:
    """
    Context manager for lifespan of the FastAPI application. Teardown of DB dependencies when application is stopped.

    Args:
        app (FastAPI): The FastAPI application instance.

    Yields:
        Generator[any, any, None]: A generator for the application lifespan.
    """
    yield
    await sessionmanager.close()


# Initialize the FastAPI app
app = FastAPI(title="FairMoney Backend", version="0.1.0")

# Add middleware for CORS handling
app.add_middleware(CORSMiddleware,
                   allow_origins=["*"],
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"])

# Import and include the routers
app.include_router(group_router)
app.include_router(payments_router)
app.include_router(accounting_router)


@app.get(path="/",
         include_in_schema=False)
def get_default_docs() -> RedirectResponse:
    """
    Redirects the root path to the API documentation.

    Returns:
        RedirectResponse: A redirection response to the API documentation.
    """
    return RedirectResponse(url="/docs",
                            status_code=status.HTTP_308_PERMANENT_REDIRECT)


# Run the app
if __name__ == "__main__":
    uvicorn.run("__main__:app", port=8001, host='0.0.0.0', reload=True)
