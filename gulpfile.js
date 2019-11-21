var gulp = require("gulp");
    nunjucksRender = require("gulp-nunjucks-render");
    data = require("gulp-data");
    watch = require("gulp-watch");
    autoprefixer = require('gulp-autoprefixer');
    stripCode = require('gulp-strip-code');
    replace = require('gulp-replace');
    minify = require('gulp-minifier');
    sass = require('gulp-sass');
    cleaning = require('gulp-initial-cleaning');
    path = "dev/";
    destination = "dist/";

    versionAppend = require('gulp-version-append');

    // destination = "../sentienceinstitute.github.io/";

cleaning({tasks: ['default'], folders: ['dist/']});

gulp.task("default", function () {
  gulp.start("compile");

  return watch(["js/app.js",
                "rss.xml",
                "page_content/**/*.+(html)",
                "pages/**/*.+(html|njk)",
                "templates/**/*.+(html|njk)",
                "js/ready.js",
                "css/sentienceinstitute.scss",
                "downloads/**/*.+(pdf)",
                "img/**/*.+(png|jpg)"],
                function() {
                  gulp.start("compile");
  });
});

gulp.task("compile", function () {
  gulp.start("css");
  gulp.start("rss");
  gulp.start("nunjucks");
  gulp.start("js");
  gulp.start("downloads");
  gulp.start("audio");
  gulp.start("img");
  gulp.start("gdoc-images");
  gulp.start("gdoc-blog-images");
  gulp.start("gdoc-press-images");
  gulp.start("favicon");
  gulp.start("favicon-blog");
  gulp.start("favicon-press");
  gulp.start("htaccess");
  gulp.start("htaccess-blog");
  gulp.start("htaccess-press");
  // gulp.start("blog");
});

gulp.task("css", function () {
  return gulp.src("css/sentienceinstitute.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(versionAppend(['css']))
    .pipe(minify({
      minify: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyJS: true,
      minifyCSS: true,
      getKeptComment: function (content, filePath) {
          var m = content.match(/\/\*![\s\S]*?\*\//img);
          return m && m.join('\n') + '\n' || '';
      }
    }))
    .pipe(gulp.dest(destination + "css/"));
});

gulp.task("rss", function () {
  return gulp.src("rss.xml")
    .pipe(gulp.dest(destination));
});

gulp.task("js", function () {
  return gulp.src(["js/ready.js", "js/parallax.min.js"])
    .pipe(minify({
      minify: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyJS: true,
      minifyCSS: true,
      getKeptComment: function (content, filePath) {
          var m = content.match(/\/\*![\s\S]*?\*\//img);
          return m && m.join('\n') + '\n' || '';
      }
    }))
    .pipe(gulp.dest(destination + "js"));
});

gulp.task("downloads", function () {
  return gulp.src(["downloads/**/*.+(pdf)"])
    .pipe(gulp.dest(destination + "downloads"));
});

gulp.task("audio", function () {
  return gulp.src(["audio/**/*.+(mp3)"])
    .pipe(gulp.dest(destination + "audio"));
});

gulp.task("img", function () {
  return gulp.src(["img/**/*.+(png|jpg)", "!img/images/**", "!img/header_photos_original/**"])
  // return gulp.src(["img/**/*.+(png|jpg)", "!img/header_photos_original/**"])
    .pipe(gulp.dest(destination + "img"));
});

gulp.task("gdoc-images", function () {
  return gulp.src(["img/images/**/*.+(png|jpg)"])
    .pipe(gulp.dest(destination + "images"));
});

gulp.task("gdoc-blog-images", function () {
  return gulp.src(["img/blog-images/*.+(png|jpg)", "img/blog-images/**", ])
    .pipe(gulp.dest(destination + "blog/images"));
});

gulp.task("gdoc-press-images", function () {
  return gulp.src(["img/press-images/*.+(png|jpg)"])
    .pipe(gulp.dest(destination + "press/images"));
});

gulp.task("favicon", function () {
  return gulp.src(["favicon.ico"])
    .pipe(gulp.dest(destination));
});

gulp.task("favicon-blog", function () {
  return gulp.src(["favicon.ico"])
    .pipe(gulp.dest(destination + "blog"));
});

gulp.task("favicon-press", function () {
  return gulp.src(["favicon.ico"])
    .pipe(gulp.dest(destination + "press"));
});

gulp.task("htaccess", function () {
  return gulp.src([".htaccess"], {dot: true})
    .pipe(gulp.dest(destination));
});

gulp.task("htaccess-blog", function () {
  return gulp.src([".htaccess"], {dot: true})
    .pipe(gulp.dest(destination + "blog"));
});

gulp.task("htaccess-press", function () {
  return gulp.src([".htaccess"], {dot: true})
    .pipe(gulp.dest(destination + "press"));
});


// gulp.task("blog", function () {
//   return gulp.src(["pages/blog/**/*.+(html|njk)"])
//     .pipe(data(function() {
//       return require("./data/data.json");
//     }))
//     .pipe(nunjucksRender({
//       path: ["templates/", "page_content/"]
//     }))
//     .pipe(stripCode({
//       pattern: /<style\stype="text\/css">.+?(?=<\/style>)<\/style>/g
//     }))
//     // For Google redirects, expression before actual link
//     .pipe(stripCode({
//       pattern: /https:\/\/www.google.com\/url\?q=/g
//     }))
//     // For Google redirects, expression after actual link
//     .pipe(stripCode({
//       pattern: /&amp;sa=D&amp;ust=(?:(?!\">).)*/g
//     }))
//     .pipe(replace(/src="images/g, "src=\"../img/images"))
//     .pipe(minify({
//       minify: true,
//       collapseWhitespace: true,
//       conservativeCollapse: true,
//       minifyJS: true,
//       minifyCSS: true,
//       getKeptComment: function (content, filePath) {
//           var m = content.match(/\/\*![\s\S]*?\*\//img);
//           return m && m.join('\n') + '\n' || '';
//       }
//     }))
//     .pipe(gulp.dest(destination));
// });

gulp.task("nunjucks", function () {
  return gulp.src(["pages/**/*.+(html|njk)"])
    .pipe(data(function() {
      return require("./data/data.json");
    }))
    .pipe(nunjucksRender({
      path: ["templates/", "page_content/"]
    }))
    //GDocs css
    .pipe(stripCode({
      pattern: /<style\stype="text\/css">.+?(?=<\/style>)<\/style>/g
    }))
    // For Google redirects, expression before actual link
    .pipe(stripCode({
      pattern: /https:\/\/www.google.com\/url\?q=/g
    }))
    // For Google redirects, expression after actual link
    .pipe(stripCode({
      pattern: /&amp;sa=D&amp;ust=(?:(?!\">).)*/g
    }))
    // .pipe(replace(/src="%3/g, "="))
    .pipe(replace(/%23/g, "#"))
    .pipe(minify({
      minify: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyJS: true,
      minifyCSS: true,
      getKeptComment: function (content, filePath) {
          var m = content.match(/\/\*![\s\S]*?\*\//img);
          return m && m.join('\n') + '\n' || '';
      }
    }))
    .pipe(versionAppend(['css']))
    .pipe(gulp.dest(destination));
});
