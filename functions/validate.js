// Validate email
const isEmail = (input) => {
    var reg =
        /^[_A-Za-z0-9-]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/

    return reg.test(input + '')
}

const isPassword = (input) => {
    return (input + '').length >= 6
}

export {
    isEmail,
    isPassword,
}