var service = new Service();

var utils = new Utils();

console.warn("Compile", utils.compile('  [[ ejemplo.adios || ejemplo.hola ]] ', {ejemplo:{hola:'esto es holaaa', adios:"esto es adios"}}));

console.log( utils.urlNormalizer('http://miapp/index.html#/hola/home?prueba=holaFrontenders') );

service.youtubeAPI().then(function(){
    console.info("youtubeAPI Jsonp example", arguments[0]);
});

var sectionToReplace = document.querySelector('section');

console.log(sectionToReplace.innerHTML);
var obj = {
    ejemplo: {
        compile : 'holalala!',
        compile2 : 'hey!'
    }
}
console.log(utils.compile(sectionToReplace.innerHTML, obj));
sectionToReplace.innerHTML = utils.compile(sectionToReplace.innerHTML, obj);
