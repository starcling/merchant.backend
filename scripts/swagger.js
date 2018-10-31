var fs = require('fs');

const swaggerFile = './docs/api/swagger.json';
const securityFile = './scripts/auth_security.json';
const tokensFile = './scripts/auth_tokens.json';

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

class Swagger {
    patch() {
        console.log('patching swagger.json...');

        let swagger = fs.readFileSync(swaggerFile, 'utf8');
        let security = fs.readFileSync(securityFile, 'utf8');
        let tokens = fs.readFileSync(tokensFile, 'utf8');

        swagger = swagger.substring(0, swagger.lastIndexOf('}')) + ',' + security + "}";
        swagger = swagger.replaceAll('uses-header ",', '",' + tokens);

        fs.writeFileSync(swaggerFile, swagger);

        console.log('done patching.');
    }
}

module.exports = new Swagger();