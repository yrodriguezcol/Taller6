class GetAllError extends Error{
    constructor(message: string, componentName?: string) {
        super(message)
        this.name = `${componentName}GetAllError`
    }
}

class GetByIdError extends Error{
    constructor(message: string, componentName?: string) {
        super(message)
        this.name = `${componentName}GetByIdError`
    }
}

class CreateError extends Error{
    constructor(message: string, componentName?: string) {
        super(message)
        this.name = `${componentName}CreateError`
    }
}
class UpdateError extends Error{
    constructor(message: string, componentName?: string) {
        super(message)
        this.name = `${componentName}UpdateError`
    }
}

export {
    GetAllError,
    GetByIdError,
    CreateError,
    UpdateError
}