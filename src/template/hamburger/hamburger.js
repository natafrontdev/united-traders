(function() {

  "use strict";

  var toggles = document.querySelectorAll(".mobilebar");
  var menu = document.querySelector(".menu");

  for (var i = toggles.length - 1; i >= 0; i--) {
    var toggle = toggles[i];
    toggleHandler(toggle);
  };

  function toggleHandler(toggle) {
    toggle.addEventListener("click", function(e) {
      e.preventDefault();
      if (this.classList.contains("is-active") === true) {
        this.classList.remove("is-active");
        menu.classList.remove("is-active");
      } else {
        this.classList.add("is-active");
        menu.classList.add("is-active");
      }
    });
  }

})();