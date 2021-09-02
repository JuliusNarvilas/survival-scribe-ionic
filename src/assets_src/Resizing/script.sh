#!/bin/bash

# on windows run this with "bash script.sh"

# Make sure globstar is enabled
shopt -s globstar
resizeTo="128"
resizeTo2="64"
resizeTo3="32"

for image_file in content/**/*.png
do

# nameFront="${image_file#*/}"
nameFront="${image_file%.*}"
folderPath="${image_file%/*}"

resizingCommand="${image_file}[${resizeTo}x${resizeTo}]"
resizingCommand2="${image_file}[${resizeTo2}x${resizeTo2}]"
resizingCommand3="${image_file}[${resizeTo3}x${resizeTo3}]"
outputFilename="${nameFront}_${resizeTo}.png"
outputFilename2="${nameFront}_${resizeTo2}.png"
outputFilename3="${nameFront}_${resizeTo3}.png"

echo "${resizingCommand} => ${outputFilename}"

mkdir -p "output/${folderPath}"

magick.exe "${resizingCommand}" "output/${outputFilename}"
magick.exe "${resizingCommand2}" "output/${outputFilename2}"
magick.exe "${resizingCommand3}" "output/${outputFilename3}"

done