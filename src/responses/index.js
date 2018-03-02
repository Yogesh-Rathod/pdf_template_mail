// Response Object For Success
exports.success = { 
  status: 200,
  message: 'All Good',
  payload: ''
};
// Response Object For Error
exports.error = {
  status: 500, // Or anything else
  message: 'Something went wrong!',
  payload: ''
};
