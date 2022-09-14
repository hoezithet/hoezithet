#!/bin/sh

srcdir="/tmp/NotoColorEmoji"
pkgdir="/usr/share/fonts/truetype/NotoColorEmoji"

mkdir $srcdir
cd $srcdir
echo "Downloading NotoColorEmoji..."
wget https://github.com/googlefonts/noto-emoji/raw/main/fonts/NotoColorEmoji.ttf

echo "Installing NotoColorEmoji..."
mkdir -p $pkgdir
find $srcdir -type f -name "*.ttf" -exec install -Dm644 {} $pkgdir \;

echo "Updating font-cache..."
fc-cache -f > /dev/null

echo "Done!"
