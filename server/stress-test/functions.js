const random = require('random-ext');

const cachedRecommendations = (context, ee, next) => {
  context.vars.id = random.integer(99999, 1);
  return next();
}

const nonCachedRecommendations = (context, ee, next) => {
  context.vars.id = random.integer(9999999, 100000);
  return next();
}

exports.cachedRecommendations = cachedRecommendations;
exports.nonCachedRecommendations = nonCachedRecommendations;