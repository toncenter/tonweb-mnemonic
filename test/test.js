var test_hmac_sha512 = async function() {
    // check against https://www.liavaag.org/English/SHA-Generator/HMAC/
    var res1 = await hmac_sha512("mustafa", "carrot");
    var reference1 = hexToBuffer("651df9349efe6bd60e33ab842eed03ca5816e0248982af6cfb42db5af28beb204524cf96e33d405cecb3c9e05a6ebf23635bc32591b828bd26e673995d511d06");
    if ((new Uint8Array(res1)).toString() != reference1.toString()) {
        console.log(res1);
        console.log(reference1);
        return new Promise(function(resolve, reject) {
            reject(new Error("Wrong  hmac_sha512('carrot', 'mustafa') result"));
        });
    }
    var res2 = await hmac_sha512("gimmler", "witcher");
    var reference2 = hexToBuffer("17389339d22f8554f4ab07d30cede0c67079c55ae9dee19709f3b4ac4a9d9b380016f76da860d3b4757cbe9dc8c0ceeda07c42fd4fb673414c3af458cd1c3eb0");
    if ((new Uint8Array(res2)).toString() != reference2.toString()) {
        console.log(res2);
        console.log(reference2);
        return new Promise(function(resolve, reject) {
            reject(new Error("Wrong  hmac_sha512('carrot', 'mustafa') result"));
        });
    }

    var res3 = await hmac_sha512("1", "");
    var reference3 = hexToBuffer("70cf5c654a3335e493c263498b849b1aa425012914f8b5e77f4b7b7408ad207db9758f7c431887aa8f4885097e3bc032ee78238157c2ad43e900b69c60aee71e");
    if ((new Uint8Array(res3)).toString() != reference3.toString()) {
        console.log(res3);
        console.log(reference3);
        return new Promise(function(resolve, reject) {
            reject(new Error('Wrong  hmac_sha512("1", "") result'));
        });
    }
    return true;
};

var test_pbkdf2_sha512 = async function() {
    // check against https://8gwifi.org/pbkdf.jsp
    var res1 = await pbkdf2_sha512(string_to_ui8a("tutturu").buffer, "blabla", 10);
    var ref1 = hexToBuffer("3817ff5ce29ec89db7a591b3ec8b053088731a7c967665b6dac9203bc1d75674800a2846c17b6e417269d787cff0b5c23aba5aab6e76ffde441633db1f2bf87b");
    if (res1.toString() != ref1.toString()) {
        console.log(res1);
        console.log(ref1);
        return new Promise(function(resolve, reject) {
            reject(new Error('pbkdf2_sha512(string_to_ui8("tutturu").buffer, "blabla", 10)'));
        });
    }

    var res2 = await pbkdf2_sha512(string_to_ui8a("gizmodo_lopez").buffer, "hashimoto", 1000);
    var ref2 = hexToBuffer("308f90aab4434b62e13ff593b5472ee8ae3672e82fe08dfe48a0a6625a9d20304134186cf9889c8b8f135a0f9d5392ed0875fcd1e50c53d54b72dc3001f48377");
    if (res2.toString() != ref2.toString()) {
        console.log(res2);
        console.log(ref2);
        return new Promise(function(resolve, reject) {
            reject(new Error('pbkdf2_sha512(string_to_ui8("gizmodo_lopez").buffer, "hashimoto", 1000)'));
        });
    }
    return true;
};