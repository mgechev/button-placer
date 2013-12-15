function PriorityRater(options) {
  this.priorityMap = _.extend({}, PriorityRater.DEFAULT_PRIORITY_MAP, options);
  this.defaultPriority = 100;
}

PriorityRater.DEFAULT_PRIORITY_MAP = {
  'textarea': 70,
  'input[type=text]': 70,
  'input[type=submit]': 90,
  'input[type=radio]': 0,
  'input[type=checkbox]': 0
}

PriorityRater.prototype.rate = function (el) {
  for (var elementType in this.priorityMap) {
    if (el.is(elementType)) console.log(el, elementType, this.priorityMap[elementType]);
    if (el.is(elementType)) return this.priorityMap[elementType];
  }
  return this.defaultPriority;
};
