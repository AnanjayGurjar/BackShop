/**There is no need to overkill with such class, you can always use the classic Error class*/
class CustomError extends Error{
    constructor(message, code){
        super(message);
        this.code;
    }
}


module.exports = CustomError;