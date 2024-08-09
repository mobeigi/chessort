FROM python:3.12-alpine

WORKDIR /server

COPY ./chessortserver ./chessortserver
COPY ./requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "-u", "-m", "chessortserver"]
