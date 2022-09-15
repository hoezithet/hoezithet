#!/bin/sh

srcdir="/tmp/NotoColorEmoji"
pkgdir="/usr/share/fonts/truetype/NotoColorEmoji"

mkdir $srcdir
cd $srcdir
echo "Downloading NotoColorEmoji..."
wget https://github.com/googlefonts/noto-emoji/raw/main/fonts/NotoColorEmoji.ttf

echo "Installing NotoColorEmoji..."
sudo mkdir -p $pkgdir
sudo find $srcdir -type f -name "*.ttf" -exec install -Dm644 {} $pkgdir \;

echo "Updating font-cache..."
sudo fc-cache -f > /dev/null

echo "Done!"
