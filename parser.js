var _ = require('lodash');

module.exports = {
  /**
   * Get each method name
   * @method getMethodNames
   * @param  {Array} methods
   * @return {Array} returns the methods with method names
   */
  getMethodNames: function getMethodNames(methods) {
    _.each(methods, function (method) {
      _.each(method.tags, function (tag) {
        if (tag.tag === 'method') {
          method.name = tag.name;
        }
      });
    });

    return methods;
  },

  /**
   * Get each method parameter
   * @method getParameters
   * @param  {Array} methods
   * @return {Array} returns the methods with parameters
   */
  getParameters: function getParameters(methods) {
    var tags;

    _.each(methods, function (method) {
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
   * Get examples for each method
   * @method getExamples
   * @param  {Array} methods
   * @return {Array} returns the methods
   */
  getExamples: function getExamples(methods) {
    _.each(methods, function (method) {
      _.each(method.tags, function (tag) {
        if (tag.tag === 'example') {
          method.example = tag.source.replace('@example ', '');
        }
      });
    });

    return methods;
  },

  groupMethods: function groupMethods(methods) {

  },
};
