FROM python:3.7-stretch

RUN apt-get update
RUN apt-get install -y binutils libproj-dev gdal-bin

RUN mkdir /src
WORKDIR /src
ADD requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
ADD . /src/
