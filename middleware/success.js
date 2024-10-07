const successHandler = (response, success, count, pagination, data)=> response.status(200).json({
        success,
        ...(count !== null && { count }),
        ...(pagination !== null && { pagination }),
        data: data
      })


module.exports = successHandler;
