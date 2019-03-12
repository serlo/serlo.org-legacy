FROM httpd:2.4 as base
COPY ./docker/httpd/httpd.conf /usr/local/apache2/conf/httpd.conf

FROM base as release
WORKDIR /usr/local/apache2/htdocs
COPY src/public src/public
RUN rm src/public/index.php
EXPOSE 80
