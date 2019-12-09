FROM alpine
RUN apk update && apk add curl

WORKDIR /tmp
RUN curl -L https://github.com/golang-migrate/migrate/releases/download/v4.7.0/migrate.linux-amd64.tar.gz | tar xzv
RUN mv migrate.linux-amd64 /usr/bin/migrate
RUN echo -e '#!/bin/sh\nmigrate -source file:///app/migrations -database $DATABASE "$@"' > /usr/bin/m && chmod +x /usr/bin/m
WORKDIR /app
COPY migrations migrations
CMD ["m", "up"]
