#!/usr/bin/env sh
npm run build
rsync -azr --update --progress dist/ yq-qcloud:/mnt/vdc/www/style-avatar/
rsync -azr --update --progress dist/ yq-jg233:/var/www/jg233.com/
