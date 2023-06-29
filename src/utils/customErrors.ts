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

export {
    GetAllError,
    GetByIdError,
    CreateError
}