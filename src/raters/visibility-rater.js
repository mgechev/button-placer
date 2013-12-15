function VisibilityRater(options) {
  this.options = options;
}

VisibilityRater.prototype.rate = function (el) {
  return el.is(':visible') ? 100 : 0;
};
