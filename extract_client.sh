#!/bin/bash

#
# PREPARE EVERYTHING
#

DIR="$(dirname "$(readlink -f "$0")")"

cd "$DIR/.support"

echo Deleting existing files

rm -r "$DIR/ClientExtracted/*"
rm -r ubuntu/*
rm "$DIR/BuildbotPaths/*"
rm -r "$DIR/Protobufs/*"

#
# EXTRACT EVERYTHING
#

echo Extracting archives

for z in *.zip;
do
	if [ "$z" = "bins_ubuntu12.zip" ];
	then
		unzip -q "$z" -d ubuntu/
	else
		unzip -q -o "$z" -d "$DIR/ClientExtracted/"
	fi
done

#
# PROTOBUF DUMP
#

echo Dumping protobufs

#mono ProtobufDumper/ProtobufDumper.exe ubuntu/ubuntu12_32/steamui.so ../Protobufs/ > /dev/null
mono ProtobufDumper/ProtobufDumper.exe ubuntu/ubuntu12_32/steamclient.so "$DIR/Protobufs/" > /dev/null

#
# BUILDBOT PATHS
#

echo Dumping buildbot paths

find ubuntu/ | sort > "$DIR/BuildbotPaths/ubuntu_binaries.txt"

for i in $(find ubuntu/ubuntu12_32/ -name '*.so');
do
	name=$(basename "$i");
	
	strings "$i" | grep "/home/buildbot/" | sed "s/^[^\/]*\//\//" | sed "s/\:[0-9]*$//" | sort -u > "$DIR/BuildbotPaths/$name.txt"
	strings "$i" -n 5 | grep "^[a-zA-Z0-9\.\_\-\%\:\/\\]*$" | grep -Evi "protobuf|GCC_except_table|home\/buildbot|[0-9]{2}:[0-9]{2}:[0-9]{2}" | sort -u > "$DIR/ClientStrings/$name.txt"
done

#
# CHANGE CRAPPY ENCODINGS TO UTF-8
#

cd "$DIR/ClientExtracted/"

echo Fixing encodings

for i in $(find -name '*.txt' -o -name '*.xml' -o -name '*.cfg' -o -name '*.res');
do
	encoding=$(file -bi "$i" | sed -e 's/.*[ ]charset=//');
	
	if [ "$encoding" != "utf-8" ] && [ "$encoding" != "binary" ];
	then
		iconv -f "$encoding" -t UTF-8 "$i" -o "$i.tmp" && mv "$i.tmp" "$i"
	fi
done

#
# CONVERT .TGA AND .ICO TO .PNG
#

echo Converting images to pngs

for i in $(find -name '*.tga');
do
	convert -strip "$i" "$i.png"
done
