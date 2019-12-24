function docReady() {
  if ($(".home-image-text")[0]){
    setTimeout(function() {
      $(function() {
        var $message = $(".home-image-text");

        $message.animate({
          opacity: 1
        }, 2000);

        $message.css("opacity", 1);
        var $wordList = $message.text().split("");
        $message.text("");
        $.each($wordList, function(idx, elem) {
          var newEl = $("<span/>").text(elem).css({
            opacity: 0
          });
          newEl.appendTo($message);
          newEl.delay(idx * 30);
          newEl.animate({
            opacity: 1
          }, 500);
        });
      });

      // Homepage image blur on scroll effect.
      // Makes page too jumpy on scroll.
      // if ($(window).width() >= 767) {
        //   $(window).scroll(function(e) {
          //     $(".home-image-text").addClass("blurring");
          //     var s = $(window).scrollTop();
          //     $(".blurring").css("text-shadow", "0 0 " + (s/50) + "px rgba(255,255,255," + (1 - (s/1000)) + ")");
          //     $(".blurring").css("font-size", 1.4 + (s/500) + "em");
          //   });
          // }
    }, 100);
  }

  $("nav a.nav-link:not(.dropdown-toggle)").click(function() {
    window.location.href = $(this).attr("destination");
  });

  if ($(".summaries-container")[0]) {
    async function removeComments() {
      // Remove comment text.
      await $("a[href*='#cmnt_ref']").parent().each((i, el) => {
        $(el).parent().remove();
      });

      // Remove comment links, after removing text.
      // (Additional and after, because this selector would catch the text too, but needs to be handled differently.)
      await $("a[href*='#cmnt']").each((i, el) => {
        let set = $(el).parent().nextUntil('span');
        let prevContent = $(el).parent().prev().html().replace(/\r?\n|\r/g, '');
        let nextContent;
        if (set[0]) {
          nextContent = $(set[set.length-1]).next().text().replace(/\r?\n|\r/g, '');
        } else if ($(el).parent().next().html()) {
          nextContent = $(el).parent().next().html();
        } else {
          nextContent = $(el).parent().next().text().replace(/\r?\n|\r/g, '');
        }

        // Check: Footnote 42, 'coexistence', footnote 66, TOC heading
        $(el).parent().prev().html(prevContent + nextContent);
        set[0] ? $(set[set.length-1]).next().remove() : $(el).parent().next().remove();
        $(el).parent().remove();
      });

      $(".summaries-container").removeClass('loading').addClass('loaded');
    }

    removeComments();
  }

  $(".image-credit").mouseenter(function(){
    var imgId = $(this).parent().parents().attr("img-id");
    var idSelector = "[img-id=\""+imgId+"\"]";
    var left = $(idSelector + " .photo-icon").position().left - 6;
    var $title = $(idSelector + " .image-title");
    $title.offset({left: left});
    $title.show();
  });
  $(".image-credit").mouseleave(function(){
    var imgId = $(this).parent().parents().attr("img-id");
    var idSelector = "[img-id=\""+imgId+"\"]";
    var $title = $(idSelector + " .image-title");
    $title.hide();
  });

  $(".person-desc").each(function(){
    $(this).html($.parseHTML($(this).text()));
  });

  if ($(".gdoc-html-container")[0]){
    $("a[href*='%3']").each(function(){
      var oldhref = this.href;
      var newhref = oldhref.replace("%3", "=");
      $(this).attr("href", newhref);
    });

    $("[id*='h.']").each(function(){

      var oldId = $(this).attr("id");
      var newId = $(this).text().replace(/\s+/g, '-').toLowerCase();
      $("[id*='"+oldId+"']").attr("id", newId);

      $("a[href^='#" + oldId + "']").each(function(){
        $(this).attr("href", '#' + newId);
      });
    });
  }

  if ($(".british-antislavery-container")[0]){
    var repeatHeadings = ["victims", "institution", "advocacy", "society"];

    repeatHeadings.forEach(function(heading){
      var counterTOC = 1;
      $("a[href^='#" + heading + "']").each(function(){
        if ($(this).attr("href") == "#" + heading) {
          $(this).attr("href", "#" + heading + counterTOC);
          counterTOC += 1;
        }
      });
      var counterHeaders = 1;
      $("h3#" + heading).each(function(){
        if ($(this).attr("id") == heading) {
          $(this).attr("id", heading + counterHeaders);
          counterHeaders += 1;
        }
      });
    });
  }

  if ($(".how-is-SI-research-different-container")[0]){
    $("ol[class*='lst-kix_'][class*='-1']+ol[class*='lst-kix_'][class*='-0']").prop("start", 2);
  }

  $("a[href^='#'], a[id^=ftnt]").click(function () {
    if (window.scroll) {
      var scrolltop = $(window).scrollTop();
      var scrollUpdater = setInterval(function(){
        var newScrolltop = $(window).scrollTop();
        if (scrolltop !== newScrolltop) {
          $(window).scrollTop(newScrolltop - 62);
          clearInterval(scrollUpdater);
        }
      },10);
    }
  });

  $(document).on("iframeinputfocus", function(event, iframeClass){
    resizeIframe($("iframe." + iframeClass)[0]);
  });

  if ($('.podcast-episode-container')[0]) {
    let $podcastTitleEl = $('.podcast-episode-writeup p:first-of-type');
    $podcastTitleEl.html(
      $podcastTitleEl.html().replace('.', '')
    );
  }
}

function elementSizing() {
    $(".gdoc-html-container:not(.animal-farming-attitudes-survey-2017-container) table tbody tr").each(function() {
      var tdCount = $(this).children("td").length;
      $(this).children("td").css("width", "calc(100%/" + tdCount +")");
    });

    $(".animal-farming-attitudes-survey-2017-container img").each(function() {
      $(this).parent().css("width", "auto");
      $(this).parent().css("height", "auto");
    });

    if ($(".research-list-container")[0]){
      // Just set up for tech studies right now, because doing with estimates looks weird.
      var researchItemContainers = $(".tech-studies-list .research-item-container");
      $(researchItemContainers).each(function(){
        var researchItemHeight = $(this).find(".research-item").height();
        $(this).children(".research-item-abstract").css("height", "calc(100% - 15px - " + researchItemHeight + "px )");
      });
    }
}

$(document).ready(function() {
  docReady();
  elementSizing();
});

$(window).resize(function(){
  elementSizing();
});
