#!/bin/bash

set -e # Enable fail-fast
rm -rf /usr/share/ssowat-copy # Delete previous backup
cp -r /usr/share/ssowat /usr/share/ssowat-copy # Create new backup
rm -rf /usr/share/ssowat/* # Delete current SSOwat instance
cd factory
npm ci
npm run compile # Creates portal files from factory
cd ..
rm -rf ./factory # Deletes factory for security reasons
mv ./* /usr/share/ssowat/ # Adds back new SSOwat instance
