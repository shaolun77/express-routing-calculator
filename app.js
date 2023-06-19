const express = require('express');
const app = express();
const ExpressError = require('./expressError');

const { convertAndValidateNumsArray, findMode, findMean, findMedian } = require('./helpers');

function calculateStat(req, res, next, operation) {
  if (!req.query.nums) {
    throw new ExpressError('Please enter a comma-separated list of numbers.', 400);
  }

  const numsAsStrings = req.query.nums.split(',');
  const nums = convertAndValidateNumsArray(numsAsStrings);

  if (nums instanceof Error) {
    throw new ExpressError(nums.message);
  }

  const result = {
    operation,
    result: operation === 'mean' ? findMean(nums) : (operation === 'median' ? findMedian(nums) : findMode(nums))
  };

  return res.send(result);
}

app.get('/mean', (req, res, next) => calculateStat(req, res, next, 'mean'));
app.get('/median', (req, res, next) => calculateStat(req, res, next, 'median'));
app.get('/mode', (req, res, next) => calculateStat(req, res, next, 'mode'));


// app.get('/mean', function (req, res, next) {
//   if (!req.query.nums) {
//     throw new ExpressError('Please enter a comma-separated list of numbers.', 400)
//   }
//   let numsAsStrings = req.query.nums.split(',');
//   // check if anything bad was put in
//   let nums = convertAndValidateNumsArray(numsAsStrings);
//   if (nums instanceof Error) {
//     throw new ExpressError(nums.message);
//   }


//   let result = {
//     operation: "mean",
//     result: findMean(nums)
//   }

//   return res.send(result);
// });

// app.get('/median', function (req, res, next) {
//   if (!req.query.nums) {
//     throw new ExpressError('Please enter a comma-separated list of numbers.', 400)
//   }
//   let numsAsStrings = req.query.nums.split(',');
//   // check if anything bad was put in
//   let nums = convertAndValidateNumsArray(numsAsStrings);
//   if (nums instanceof Error) {
//     throw new ExpressError(nums.message);
//   }

//   let result = {
//     operation: "median",
//     result: findMedian(nums)
//   }

//   return res.send(result);

// });

// app.get('/mode', function (req, res, next) {
//   if (!req.query.nums) {
//     throw new ExpressError('Please enter a comma-separated list of numbers.', 400)
//   }
//   let numsAsStrings = req.query.nums.split(',');
//   // check if anything bad was put in
//   let nums = convertAndValidateNumsArray(numsAsStrings);
//   if (nums instanceof Error) {
//     throw new ExpressError(nums.message);
//   }

//   let result = {
//     operation: "mode",
//     result: findMode(nums)
//   }

//   return res.send(result);


// });

/** general error handler */

app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


app.listen(3000, function () {
  console.log(`Server starting on port 3000`);
});
