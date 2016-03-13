var _ = require('lodash');

/**
 * Checks if a method has a specific tag
 * @method hasTag
 * @private
 * @param  {Object} methods
 * @return {Boolean} Returns a boolean
 */
function hasTag(methods, tag, cb) {
  return methods.map(method => {
    _.each(method.tags, tag => {
      if (tag.tag === tag) {
        return method;
      }
    });
  });
}

module.exports = {

  getDeprecated: function getDeprecated(methods) {

    methods.forEach(method => {
      _.each(method.tags, tag => {
        if (tag.tag === 'deprecated') {
          method.deprecated = true;
        }
      });
    });

    return methods;

  },

  /**
   * Adds the name to each method
   * @method getMethodNames
   * @group Parser
   * @deprecated
   * @param  {object} methods
   * @return {object} returns the methods with method names
   */
  getMethodNames: function getMethodNames(methods) {

    methods.forEach(method => {
      _.each(method.tags, function (tag) {
        if (tag.tag === 'method') {
          method.name = tag.name;
        }
      });
    });

    return methods;
  },

  /**
   * Gets each method parameter
   * @method getParameters
   * @group Parser
   * @param  {Object} methods
   * @return {Object} returns the methods with parameters
   */
  getParameters: function getParameters(methods) {
    var tags;

    methods.forEach(method => {
      method.params = [];

      tags = method.tags;
      _.each(tags, function (tag) {
        if (tag.tag === 'param') {
          method.params.push(tag);
        }
      });
    });

    return methods;
  },

  /**
   * Gets examples for each method
   * @method getExamples
   * @group Parser
   * @param  {Object} methods
   * @return {Object} returns the methods
   */
  getExamples: function getExamples(methods) {

    methods.forEach(method => {
      _.each(method.tags, function (tag) {
        if (tag.tag === 'example') {
          method.example = tag.source.replace('@example ', '');
        }
      });
    });

    return methods;
  },

  /**
   * Groups the methods based on their "@group" tag
   * @method groupMethods
   * @group parser
   * @param  {Object} methods
   * @return {Object} Returns the grouped and ungrouped methods
   */
  groupMethods: function groupMethods(methods) {
    var grouped = {};
    var ungrouped = [];

    methods.forEach(method => {

      // Method is grouped
      if (_.some(method.tags, { tag: 'group' })) {
        _.each(method.tags, tag => {
          if (tag.tag === 'group') {

            tagName = tag.name.toLowerCase();

            if (grouped.hasOwnProperty(tagName)) {
              grouped[tagName].push(method);
            } else {
              grouped[tagName] = [];
              grouped[tagName].push(method);
            }
          }
        });

      // Method is ungrouped
      } else {
        ungrouped.push(method);
      }
    });

    methods = Object.assign({}, { grouped }, { ungrouped });
    return methods;
  },
};
