export function mutateWhile(str, condition, transform) {
    let result = str;
    while(condition(result)){
        result = transform(result);
    }
    return result;
}

export function toCamelCase(str) {

    if(!str){
        return 
    }

    const temp = str.replace(/\s/g, "").trim()

    if(temp.length===0){
        return ''
    }

    return temp[0].toLowerCase() + temp.substring(1)
}


export function camelToSentenceCase(str) {

    const tokens = str.replace(/([A-Z]+)/g, " $1").trim().split(' ')

    return tokens.filter(t=>t && t.length).map(token => {
        const trimmed = token.trim()
        return trimmed[0].toUpperCase() + trimmed.substring(1)
    }).join(' ')

}

export function camelToKebabCase(str) {
    const tokens = str.replace(/([A-Z]+)/g, " $1").trim().split(' ')
    return tokens.map(token => {
        return token.trim().toLowerCase()
    }).join('-')
}

export function toProperCase(str) {
    if(str.length){
        return str[0].toUpperCase() + str.substring(1)
    }
}


export function right(str, number) {
    if(str.length){
        return str.substring(str.length - number)
    }
}

export function asPhone(str) {
    const phoneNumberString = str
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }
    return null
}

