/*
 * jQuery.onAppear v0.1.2
 * https://github.com/neopeak/jquery.onAppear
 *
 * Copyright 2014, Cedric Veilleux <cveilleux@neopeak.com>
 *
 * Licensed under the Apache v2 Licence
 */
;(function($) {

  function inViewport(element, viewportRect) {

    if (!$(element).is(':visible')) {
      return false;
    }

    var elementRect = element.getBoundingClientRect();

    // Visible if it has at least one of its corner in the container
    var corners = [{x: elementRect.left, y: elementRect.top},
                   {x: elementRect.right, y: elementRect.top},
                   {x: elementRect.left, y: elementRect.bottom},
                   {x: elementRect.right, y: elementRect.bottom}];

    for(var i = 0; i < corners.length; i++) {
      var corner = corners[i];
      if (corner.y <= viewportRect.bottom &&
          corner.y >= viewportRect.top &&
          corner.x >= viewportRect.left &&
          corner.x <= viewportRect.right) {
        return true;
      }
    }

    // Visible if taller than viewport
    if (elementRect.top <= viewportRect.top && elementRect.bottom >= viewportRect.bottom) {
      return true;
    }

    // Visible if wider than viewport
    if (elementRect.left <= viewportRect.left && elementRect.right >= viewportRect.right) {
      return true;
    }

    return false;
  }

  /**
   * Checks if a container still contains an element.
   */
  function elementIsInContainer(container, element) {
    if (container[0] == window) {
      return $('body')[0].contains(element);
    } else {
      return container[0].contains(element);
    }
  }

  function getViewport(container) {
    if (container[0] == window) {
      var screenHeight = window.innerHeight || document.documentElement.clientHeight;
      var screenWidth = window.innerWidth || document.documentElement.clientWidth;
      return {top: 0, left: 0, right: screenWidth, bottom: screenHeight, height: screenHeight, width: screenWidth};
    }
    return container[0].getBoundingClientRect();
  }

  function delayedAppearCheck(instance) {
    if (instance.timer) {
       clearTimeout(instance.timer);
    }
    instance.timer = setTimeout(
      function() {
        instance.timer = false;
        appearCheck(instance);
      },
      instance.options.scrollDelay
    );
  }

  function appearCheck(instance) {
    // do nothing if all items have been processed
    if (instance.items.length == 0)
      return;

    // what's the viewport?
    var viewportRect = getViewport(instance.options.container);

    // find the elements that are in viewport
    var newList = [];
    for(var i = 0; i < instance.items.length; i++) {

      var keepItem = true;

      // check if the element is still in the container
      if (!elementIsInContainer(instance.options.container, instance.items[i])) {
        // item is no longer inside the container. It has probably been cleaned-up by another script.
        keepItem = false;

      } else if (inViewport(instance.items[i], viewportRect)) {
        $(instance.items[i]).trigger(instance.options.event);
        keepItem = !instance.options.once;

      }

      if (keepItem) {
        newList.push(instance.items[i]);
      }
    }

    instance.items = newList;

  }

  $.fn.initAppear = function(options) {
    // do nothing if nothing selected
    if($(this).length == 0)
      return;

    var defaults = {
      container: $(window),
      scrollDelay: 200,
      event: 'appear',
      once: false,
    };

    options = $.extend(defaults, options);

    var instance = {options: options, items: this.get()};

    var instanceChecker = function() {
      delayedAppearCheck(instance);
    };

    options.container.on('scroll', instanceChecker);
    $(window).on('resize', instanceChecker);

    appearCheck(instance);
  };

})(jQuery);
