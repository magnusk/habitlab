/*jslint browser: true, devel: true, node: true, ass: true, nomen: true, unparam: true, indent: 4 */

/**
 * @license
 * Copyright (c) 2015 The ExpandJS authors. All rights reserved.
 * This code may only be used under the BSD style license found at https://expandjs.github.io/LICENSE.txt
 * The complete set of authors may be found at https://expandjs.github.io/AUTHORS.txt
 * The complete set of contributors may be found at https://expandjs.github.io/CONTRIBUTORS.txt
 */
(function () {
    "use strict";

    var assertArgument = require('../assert/assertArgument'),
        getNext        = require('../array/getNext'),
        isNode         = require('../tester/isNode');

    /**
     * Returns the element immediately following the specified element, in the same tree level.
     *
     * ```html
     *  <ul>
     *      <li class="one"></li>
     *      <li class="two"></li>
     *      <li class="three"></li>
     *      <li class="four"></li>
     *  </ul>
     *
     *  <script>
     *      var elem = document.querySelector('.two');
     *
     *      console.log(elem);
     *      // => <li class="two"></li>
     *
     *      XP.getNextElement(elem);
     *      // => <li class="three"></li>
     *  </script>
     * ```
     *
     * @function getNextElement
     * @param {Node} node The reference node
     * @returns {Element | undefined} Returns the next element or undefined
     */
    module.exports = function getNextElement(node) {
        assertArgument(isNode(node), 1, 'Element');
        return getNext(node.parentNode.children, node);
    };

}());