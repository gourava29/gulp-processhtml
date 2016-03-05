'use strict';
var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

module.exports = function(processor) {
    processor.registerBlockType('cssmin', function (content, block, blockLine) {
        var match = blockLine.match(/build:cssmin ['"]?(.+?)['"]?\s+?-->/i);
        var outputFileDest,outputFileName,sourceFileLoc;
        var currentWorkingDir = process.env.PWD;
        if(match.length>1){
        	sourceFileLoc = match[1].split(' ')[0];
        	outputFileDest = match[1].split(' ')[1];
			    outputFileName = match[1].split(' ')[2];
        }
        	
        var scriptArray = blockLine.match(/href="([^"]+).css"/g);
        var stylesToMinimize = [];
        for(var i in scriptArray)        {
        	stylesToMinimize.push(currentWorkingDir+sourceFileLoc+scriptArray[i].replace('href="','').replace('"',''));
        }
        gulp.src(stylesToMinimize)
      	    .pipe(minifyCSS())
      	    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
      	    .pipe(concat(outputFileName))
      	    .pipe(gulp.dest(process.env.PWD+outputFileDest));
		    return content.replace(blockLine, "<link rel='stylesheet' href='"+outputFileName+"'/>");
    });
};
