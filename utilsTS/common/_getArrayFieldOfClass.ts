
function getKeys(myClass): string[] {
    let tmp = new myClass();
    return Object.getOwnPropertyNames(tmp);
}
export default getKeys