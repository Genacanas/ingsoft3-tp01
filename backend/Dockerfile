FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --prefix=/install -r requirements.txt

FROM builder AS test
RUN pip install -r requirements.txt
COPY . .
ENV COVERAGE_FILE=/out/.coverage
ENTRYPOINT ["python", "-m", "pytest", "--cov=logica", "--cov=servicios", "--cov-fail-under=80", "--cov-report=html:/out/htmlcov", "--cov-report=xml:/out/coverage.xml"]

FROM python:3.11-slim AS runtime
WORKDIR /app
COPY --from=builder /install /usr/local
COPY . .
EXPOSE 8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]