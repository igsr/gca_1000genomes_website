(function () {
  "use strict";

  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest("a[href]");

    if (link && /^https?:$/.test(link.protocol) && link.host !== window.location.host) {
      link.target = "_blank";
      link.relList.add("noopener", "noreferrer");
    }
  });
})();
