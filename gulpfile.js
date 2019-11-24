const { parallel, series, src, dest, watch } = require("gulp"),
    autoprefixer = require('gulp-autoprefixer'),
    // babel = require('babel'),
    data = require("gulp-data"),
    del = require('del'),
    destination = "dist/",
    minify = require('gulp-minifier'),
    nunjucksRender = require("gulp-nunjucks-render"),
    path = "dev/",
    replace = require('gulp-replace'),
    sass = require('gulp-sass'),
    stripCode = require('gulp-strip-code'),
    versionAppend = require('gulp-version-append');

function compile() {
  return series(css, rss, nunjucks, js, downloads, audio, img, gdocImages, gdocBlogImages, gdocPressImages, favicon, faviconBlog, faviconPress, htaccess, htaccessBlog,
  htaccessPress);
}

function watcher() {
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
          // This compiles everything again, when a single doc is changed...
          compile();
  });
}

exports.compile = compile();
exports.watcher = watcher;
exports.default = series(compile(), watcher);

function css() {
  return src("css/sentienceinstitute.scss")
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
    .pipe(dest(destination + "css/"));
}

function rss() {
  return src("rss.xml")
    .pipe(dest(destination));
}

function js() {
  return src(["js/ready.js", "js/parallax.min.js"])
    // .pipe(babel())
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
    .pipe(dest(destination + "js"));
}

function downloads() {
  return src(["downloads/**/*.+(pdf)"])
    .pipe(dest(destination + "downloads"));
}

function audio() {
  return src(["audio/**/*.+(mp3)"])
    .pipe(dest(destination + "audio"));
}

function img() {
  return src(["img/**/*.+(png|jpg)", "!img/images/**", "!img/header_photos_original/**"])
  // return src(["img/**/*.+(png|jpg)", "!img/header_photos_original/**"])
    .pipe(dest(destination + "img"));
}

function gdocImages() {
  return src(["img/images/**/*.+(png|jpg)"])
    .pipe(dest(destination + "images"));
}

function gdocBlogImages() {
  return src(["img/blog-images/*.+(png|jpg)", "img/blog-images/**", ])
    .pipe(dest(destination + "blog/images"));
}

function gdocPressImages() {
  return src(["img/press-images/*.+(png|jpg)"])
    .pipe(dest(destination + "press/images"));
}

function favicon() {
  return src(["favicon.ico"])
    .pipe(dest(destination));
}

function faviconBlog() {
  return src(["favicon.ico"])
    .pipe(dest(destination + "blog"));
}

function faviconPress() {
  return src(["favicon.ico"])
    .pipe(dest(destination + "press"));
}

function htaccess() {
  return src([".htaccess"], {dot: true})
    .pipe(dest(destination));
}

function htaccessBlog() {
  return src([".htaccess"], {dot: true})
    .pipe(dest(destination + "blog"));
}

function htaccessPress() {
  return src([".htaccess"], {dot: true})
    .pipe(dest(destination + "press"));
}


// function blog() {
//   return src(["pages/blog/**/*.+(html|njk)"])
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
//     .pipe(dest(destination));
// }

function nunjucks() {
  return src(["pages/**/*.+(html|njk)"])
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
    .pipe(dest(destination));
}
