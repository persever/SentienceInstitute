const { parallel, series, src, dest, watch } = require("gulp"),
    autoprefixer = require('gulp-autoprefixer'),
    // babel = require('babel'),
    // change = require('gulp-change'),
    data = require("gulp-data"),
    destination = "dist/",
    file = require('gulp-file'),
    fs = require('fs'),
    minify = require('gulp-minifier'),
    nunjucksRender = require("gulp-nunjucks-render"),
    rename = require("gulp-rename"),
    replace = require('gulp-replace'),
    sass = require('gulp-sass')(require('sass')),
    stripCode = require('gulp-strip-code'),
    versionAppend = require('gulp-version-append');

function compile() {
  //  NEED A CLEANER!!
  return series(css, fonts, compilePodcastEpisodes, njk, js, downloads, audio, img, gdocImages, gdocBlogImages, gdocPressImages, favicon, htaccess
    // , htaccessBlog, htaccessPress
  );
}

function watcher() {
  return watch(["js/app.js",
        "fonts/*.+(ttf)",
        "page_content/**/*.+(html)",
        "pages/**/*.+(html|njk)",
        "templates/**/*.+(html|njk)",
        "js/prod/ready.js",
        "css/sentienceinstitute.scss",
        "downloads/**/*.+(pdf)",
        "img/**/*.+(png|jpg)"],
          // This compiles everything again, when a single doc is changed...
        compile()
  );
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

function js() {
  return src(["js/prod/*.js"])
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

// function rss() {
//   return src("rss.xml")
//     .pipe(dest(destination));
// }

function fonts() {
  return src(["fonts/*.+(ttf)"])
    .pipe(dest(destination + "fonts"));
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
    .pipe(dest(destination))
    .pipe(dest(destination + "blog"))
    .pipe(dest(destination + "press"))
    .pipe(dest(destination + "podcast"));
}

function htaccess() {
  return src([".htaccess"], {dot: true})
    .pipe(dest(destination));
}

//should export to dev, then njk can take it to dist
async function compilePodcastEpisodes() {
  const podcasts = JSON.parse(fs.readFileSync('data/data.json')).podcastitems;
  const episode = podcasts[0];
  podcasts.forEach(function(episode) {
    return src('templates/partials/podcastepisode.njk')
      .pipe(nunjucksRender({path: ['templates/', 'page_content'], data: {"episode": episode}, ext: '.html'}))
      .pipe(rename('episode-' + episode.no + '.html'))
      // Refactor with njk()...
      .pipe(stripCode({
        pattern: /<style\stype="text\/css">.+?(?=<\/style>)<\/style>/g
      }))
      .pipe(stripCode({
        pattern: /https:\/\/www.google.com\/url\?q=/g
      }))
      .pipe(stripCode({
        pattern: /&amp;sa=D&amp;ust=(?:(?!\">).)*/g
      }))
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
      .pipe(dest(destination + 'podcast'));
  });
}

async function njk(d) {
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
    // As of April 2021, Google Docs exports query strings like this: &amp;sa=D&amp;source=editors&amp;ust=1619363555701000&amp;usg=AOvVaw16XvCGXmufbBn1KL4yo1Mt where the last string varies
    .pipe(stripCode({
      // pattern: /&amp;sa=D&amp;ust=(?:(?!\">).)*/g
      pattern: /&amp;sa=D&amp;(?:(?!\">).)*/g
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
