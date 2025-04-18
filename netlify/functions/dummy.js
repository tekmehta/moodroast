// Simple serverless function to test Netlify deployment
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Server is running correctly!",
      success: true
    })
