#!/bin/sh

srcdir="/tmp/Quicksand"
pkgdir="/usr/share/fonts/truetype/Quicksand"

mkdir $srcdir
cd $srcdir
echo "Cloning Quicksand Git repository..."
git clone https://github.com/andrew-paglinawan/QuicksandFamily

echo "Installing Quicksand..."
mkdir -p $pkgdir
find $srcdir -type f -name "*.ttf" -exec install -Dm644 {} $pkgdir \;

echo "Updating font-cache..."
fc-cache -f > /dev/null

echo "Done!"
