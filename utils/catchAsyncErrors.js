/**
 *   Catch Errors Handler
  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchAsyncErrors(), catch any errors they throw, and pass it along to our express middleware with next()
  
*/

const catchAsyncErrors = (fn) => (req, res, next) => {
    fn(req, res, next).catch(next);
};

export default catchAsyncErrors;
