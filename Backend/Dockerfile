FROM golang:1.24-alpine

RUN apk add --no-cache git build-base

WORKDIR /app

RUN go install github.com/air-verse/air@latest

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN mkdir -p tmp

EXPOSE 8080

CMD ["air", "-c", "air.toml"]
