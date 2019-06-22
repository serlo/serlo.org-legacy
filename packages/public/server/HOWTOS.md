# Debian 8 Athene2 Base Image Bootstrap

```
adduser serlo --disabled-password --disabled-login
apt-get -y update
apt-get install -y python-software-properties python g++ make python-software-properties
apt-get install -y apache2 mysql-server-5.5 git
apt-get install -y inotify-tools

# Does not exist on Debian 8?
# apt-get install -y language-pack-de-base
# Instead to:
apt-get install -y locales locales-all
locale-gen de_DE.UTF-8

# Install PHP and Apache stuff
# Check this guide instead:
# https://www.linode.com/docs/websites/apache/running-fastcgi-php-fpm-on-debian-7-with-apache
# apt-get install -y apache2-mpm-worker php5-fpm php5 php5-intl php5-mysql php5-curl php-pear phpmyadmin php5-cli php-apc php-xml-parser

# npm pm2 --unsafe-perm
npm -g install bower grunt grunt-cli pm2 dnode

sudo sed -i "s/\;pcre\.backtrack\_limit=100000/pcre\.backtrack\_limit=10000/" /etc/php5/fpm/php.ini
sudo sed -i "s/\memory\_limit = 128M/memory\_limit = 1024M/" /etc/php5/fpm/php.ini
sudo sed -i "s/\upload\_max\_filesize = .*M/upload\_max\_filesize = 128M/" /etc/php5/fpm/php.ini
sudo sed -i "s/\post\_max\_size = .*M/post\_max\_size = 128M/" /etc/php5/fpm/php.ini

sudo sed -i "s/\;pcre\.backtrack\_limit=100000/pcre\.backtrack\_limit=10000/" /etc/php5/cli/php.ini
sudo echo "apc.enabled = 1" >> /etc/php5/cli/php.ini
sudo echo "apc.enable_cli = 1" >> /etc/php5/cli/php.ini

sudo service php5-fpm restart
sudo service apache2 restart
```

Insert into _/etc/apache2/sites-enabled/athene2.conf_:

```
<VirtualHost *:80>
        ServerName de.serlo.org
        ServerAdmin info-de@serlo.org
        ServerAlias en.serlo.org
        DocumentRoot /home/serlo/athene2/src/public

        <Directory />
                Options FollowSymLinks
                AllowOverride None
        </Directory>
        <Directory /home/serlo/athene2/src/public>
                IndexIgnore .htaccess *~ *.bak *.old
                Options -Indexes FollowSymLinks MultiViews
                AllowOverride All

                # Apache 2.2
                # Order allow,deny
                # Allow from all

                # Apache 2.4
                Require all granted

                AddDefaultCharset utf-8
                AddCharset utf-8 .js .css

                <Files .*>
                        # Apache 2.2
                        # Order Deny,Allow
                        # Deny From All

                        # Apache 2.4
                        Require all denied
                </Files>

                <FilesMatch "\.(ttf|otf|eot)$">
                        <IfModule mod_headers.c>
                                Header set Access-Control-Allow-Origin "*"
                        </IfModule>
                </FilesMatch>

                <FilesMatch ".*\.(html|php|css|js)$">
                  SetOutputFilter DEFLATE
                </FilesMatch>

                <FilesMatch "\.(jpg|jpeg|gif|png|js|css|woff|ttf|svg|eot)$">
                        Header set Cache-control "public, max-age=600"
                </FilesMatch>
        </Directory>

        LogFormat "%{X-Forwarded-For}i %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\"" combined
        ErrorLog /var/log/apache2/athene2.error.log
        CustomLog "|/usr/bin/rotatelogs /var/log/apache2/athene2.serlo.org.%Y.%m.%d 172800" combined

        LogLevel warn
        ServerSignature Off
</VirtualHost>
```

You should now set up mysql (set user, upload database dump). You can do so by going to http://server-ip-address/phpmyadmin . If you want to change this directory (which you should), take a look at the config in _/etc/apache2/conf-enabled/phpmyadmin.conf_.

```
cd /home/serlo
su serlo
git clone https://github.com/serlo-org/athene2.git
cd athene2
php composer.phar install
cd src/assets
npm install && bower install
cd ../../bin
sh deploy.sh
exit
# Add www-data to serlo gorup (deprecated)
usermod -a -G serlo www-data
chmod 774 -R /home/serlo/athene2
```

There are also two scripts which should be executed regularly

```
su serlo
crontab -e

# Sends out notifications every 5 minutes
* */5 * * * su - serlo -c '(cd .../athene2/src/public; php index.php notification worker)'
# Cleans up session sto
* 05 * * * su - serlo -c '(cd .../athene2/src/public; php index.php session gc)'
```

# Converting phtml to twig (Careful, buggy!)

1. Echo
   1. `\<\?php\s*echo (.*);\s*\?>`
   2. `{{ $1 }}`
2. If
   1. `\<\?php\s*if\s*\((.*)\)\:\s*\?\>`
   2. `{% if $1 %}`
   3. `\<\?php\s*endif;\s*\?\>`
   4. `{% endif %}`
3. Foreach
   1. `\<\?php\s*foreach\s*\((.*)\s*as\s*(.*)\)\:\s*\?\>`
   2. `{% for $2 in $1 %}`
   3. `\<\?php\s*endforeach;\s*\?\>`
   4. `{% endfor %}`
4. This
   1. `\$this\-\>`
   2. ``
5. ->
   1. `\-\>`
   2. `.`
6. \$
   1. `\$([a-zA-Z0-9]+)`
   2. `$1`
7. array
   1. `array\(([a-zA-Z\'\=\>\(\)\-]+)\)`
   2. `{ $1 }`
8. array =>
   1. `\=\>`
   2. `:`
9. translate
   1. `translate\((.*)\)`
   2. `$1 | trans`

POEDIT

`WXTRACE=poedit,poedit.tmp,poedit.execute /Applications/Poedit.app/Contents/MacOS/Poedit --verbose --keep-temp-files`
